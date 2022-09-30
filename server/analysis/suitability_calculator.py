import numpy as np
import rasterio
import os
import json
import geopandas as gp

from numpy_encoder import NumpyEncoder
from osgeo import gdal
from osgeo.gdalconst import *
from rasterio.features import shapes

from analysis.feature import CategoricalFeature, ContinuousFeature
from analysis.objective import Objective
from analysis.study_area import StudyArea
from analysis.raster_transform import DEFAULT_EMPTY_VAL, convert_projection


class SuitabilityCalculator:
    def __init__(self, working_path):
        self.path = working_path

        self.objectives_arrays_dict = {}

        self.missing_mask_dict = {}

        self.cell_size = 20
        self.study_area = None

        # is this the saved end result of the analysis?
        self.output_matrix = None

    """
    Setters
    """

    def set_cell_size(self, cell_size):
        self.cell_size = cell_size

    def set_study_area_input(self, path, crs):
        self.study_area = StudyArea(path)
        self.study_area.update(self.path, self.cell_size, crs)

    """
    Getters
    """

    def get_array(self):
        return self.output_matrix

    def get_study_area(self):
        return self.study_area

    def get_missing_at(self, latitude, longitude):
        x, y = self.geo_coordinate_to_matrix_coordinate(latitude, longitude)
        missing_val = []
        for key in self.missing_mask_dict:
            if self.missing_mask_dict[key][y, x]:
                missing_val.append(key)
        return missing_val

    def geo_coordinate_to_matrix_coordinate(self, latitude, longitude):
        src = gdal.Open(os.path.join(self.path, "output_study_area.tiff"))
        ulx, _, _, uly, _, _ = src.GetGeoTransform()
        # TODO: 4326 -> 3857 looking oddly hardcoded (missing refactor mistake?)
        x, y = convert_projection(4326, 3857, latitude, longitude)
        cx = int((x - ulx) // self.cell_size)
        cy = -int((y - uly) // self.cell_size) - 1
        return cx, cy

    # I believe this should be moved to a utils class
    def matrix_to_raster(self, matrix):
        matrix = np.int16(matrix)
        study_area_path = os.path.join(self.path, StudyArea.OUTPUT_NAME)
        output_name = "output.tiff"
        output_path = os.path.join(self.path, output_name)

        inDs = gdal.Open(study_area_path)
        driver = inDs.GetDriver()
        outDs = driver.Create(output_path, len(matrix[0]), len(matrix), 1, GDT_Int16)
        # write the data
        outBand = outDs.GetRasterBand(1)
        outBand.WriteArray(matrix, 0, 0)

        # flush data to disk, set the NoData value and calculate stats
        outBand.FlushCache()
        outBand.SetNoDataValue(-99)

        # georeference the image and set the projection
        outDs.SetGeoTransform(inDs.GetGeoTransform())
        outDs.SetProjection(inDs.GetProjection())
        return output_name

    # I believe this should be moved to a utils class
    def tiff_to_geojson(self, tiff_name):
        input_path = os.path.join(self.path, tiff_name)
        data = rasterio.open(input_path).meta
        c = str(data["crs"])
        mask = None
        with rasterio.open(input_path) as src:
            image = src.read()  # first band
            image = np.int16(image)
            results = (
                {"properties": {"suitability": suitability}, "geometry": geometry}
                for geometry, suitability in shapes(image, mask=mask, transform=data["transform"])
            )
            geoms = list(results)
            gpd_polygonized_raster = gp.GeoDataFrame.from_features(geoms, crs=c)
            # gpd_polygonized_raster = gpd_polygonized_raster[gpd_polygonized_raster['NDVI'] > 0]
            # gpd_polygonized_raster.to_file('temp/dataframe.geojson', driver='GeoJSON')

            # cs convertion
            gpd_polygonized_raster = gpd_polygonized_raster.to_crs(4326)  # Where these numbers come from?
            output_geojson_name = "analysis.geojson"
            gpd_polygonized_raster.to_file(os.path.join(self.path, output_geojson_name))
            return gpd_polygonized_raster

    # I believe this should be moved to a utils class
    # def get_informations_at(self, latitude, longitude):
    #     x, y = self.geo_coordinate_to_matrix_coordinate(latitude, longitude)
    #     cell_values = {}
    #     for key in self.objectives_arrays_dict:
    #         obj = self.objectives_arrays_dict[key]
    #         if (
    #             y >= 0
    #             and y < obj.shape[0]
    #             and x >= 0
    #             and x < obj.shape[1]
    #             and self.study_area.as_array[y, x] != DEFAULT_EMPTY_VAL
    #         ):

    #             cell_values[key] = obj[y, x]
    #         else:
    #             return {}
    #     return cell_values

    def run(self, hierarchy: Objective):
        (self.output_matrix, self.objectives_arrays_dict) = hierarchy.process_value_matrix()
        self.objectives_arrays_dict[hierarchy.id] = self.output_matrix
        return self.output_matrix, self.objectives_arrays_dict

    def to_json(self) -> dict:
        return json.dumps(self.objectives_arrays_dict, cls=NumpyEncoder)

    def to_geojson(self) -> dict:
        areas = {}
        for id, output_matrix in self.objectives_arrays_dict.items():
            output_matrix *= 100
            output_matrix[self.study_area.as_array == DEFAULT_EMPTY_VAL] = -1
            raster_path = self.matrix_to_raster(output_matrix)
            geojson = self.tiff_to_geojson(raster_path).to_json()
            areas[id] = json.loads(geojson)

        return areas


class ObjectiveHierarchyBuilder:
    def __init__(self, working_path: str, main: str, cell_size: float, crs: str, study_area: StudyArea):
        self.root: Objective = Objective(main, 1, cell_size, crs, study_area)
        self.path: str = working_path
        self.output_path: str = "output.tiff"

    def get_objectives(self) -> Objective:
        return self.root

    def add_objective(self, name: str, weight: float, parent_id=None) -> Objective:
        parent = self.root if not parent_id else self.root.get_subobjective_by_id(parent_id)
        return parent.add_subobjective(name, weight)

    def add_continuous_attribute_to_subobjective(
        self,
        parent_id,
        attribute_name,
        dataset_path,
        weight,
        scaling_function,
        missing_data_default_value,
        field_name=False,
    ) -> ContinuousFeature:
        return self.root.get_subobjective_by_id(parent_id).add_continuous_attribute(
            name=attribute_name,
            dataset_path=os.path.join(self.path, dataset_path),
            output_tiff=os.path.join(self.path, self.output_path),
            weight=weight,
            scaling_function=scaling_function,
            missing_data_default_value=missing_data_default_value,
            field_name=field_name,
        )

    def add_categorical_attribute_to_subobjective(
        self,
        parent_id,
        attribute_name,
        dataset_path,
        weight,
        scaling_function,
        missing_data_default_value,
        categories,
        field_name,
    ) -> CategoricalFeature:
        return self.root.get_subobjective_by_id(parent_id).add_categorical_attribute(
            name=attribute_name,
            dataset_path=os.path.join(self.path, dataset_path),
            output_tiff=os.path.join(self.path, self.output_path),
            weight=weight,
            scaling_function=scaling_function,
            missing_data_default_value=missing_data_default_value,
            categories=categories,
            field_name=field_name,
        )

    def add_calculated_attribute_to_subobjective(
        self,
        parent_id,
        attribute_name,
        dataset_path,
        weight,
        scaling_function,
        missing_data_default_value,
        max_distance,
        granularity=10,
        centroid=True,
        field_name=False,
    ) -> ContinuousFeature:
        return self.root.get_subobjective_by_id(parent_id).add_distance_attribute(
            name=attribute_name,
            dataset_path=os.path.join(self.path, dataset_path),
            output_tiff=os.path.join(self.path, self.output_path),
            weight=weight,
            scaling_function=scaling_function,
            missing_data_default_value=missing_data_default_value,
            maximize_distance=True,
            max_distance=max_distance,
            centroid=centroid,
            granularity=granularity,
            threshold=0.8,
            field_name=field_name,
        )
