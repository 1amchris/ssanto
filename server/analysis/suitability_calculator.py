from analysis.feature import CategoricalFeature, ContinuousFeature
from .objective import Objective
from osgeo import gdal, osr
import numpy as np
from osgeo.gdalconst import *
import rasterio
from rasterio.features import shapes
import geopandas as gp
from .study_area import StudyArea
import os
from .raster_transform import DEFAULT_EMPTY_VAL, convert_projection


class SuitabilityCalculator:
    def __init__(self, working_path):
        self.path = working_path

        # what's the difference?
        # self.objectives = {} # the objectives builder has been moved to the ObjectiveHierarchyBuilder class
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
                {"properties": {"sutability": suitability}, "geometry": geometry}
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

    def run(self, objectives):
        self.objectives_arrays_dict = {}
        self.missing_mask_dict = {}
        output_matrix = np.zeros(self.study_area.as_array.shape)
        total_weight = 0
        for objective in objectives:
            data, sub_objective_array_dict = objective.process_value_matrix()
            partial_missing_mask_dict = objective.get_missing_mask()
            self.missing_mask_dict.update(partial_missing_mask_dict)
            objective_weight = objective.weight
            self.objectives_arrays_dict[objective.name] = data
            self.objectives_arrays_dict.update(sub_objective_array_dict)
            output_matrix += self.objectives_arrays_dict[objective.name] * objective_weight
            total_weight += objective_weight

        output_matrix = output_matrix / total_weight * 100
        mask = self.study_area.as_array == DEFAULT_EMPTY_VAL
        output_matrix[mask] = -1
        self.output_matrix = output_matrix
        self.objectives_arrays_dict["ANALYSIS"] = output_matrix / 100

        return output_matrix

    def process_sub_objectives(self):
        sub_objectives_json = {}
        for key in self.objectives_arrays_dict:
            if key != "ANALYSIS":
                output_matrix = self.objectives_arrays_dict[key] * 100
                mask = self.study_area.as_array == DEFAULT_EMPTY_VAL
                output_matrix[mask] = -1
                path = self.matrix_to_raster(output_matrix)
                analysis_df = self.tiff_to_geojson(path)
                sub_objectives_json[key] = {
                    "file_name": key,
                    "area": analysis_df.to_json(),
                }

        return sub_objectives_json


class ObjectiveHierarchyBuilder:
    def __init__(self, working_path: str):
        self.hierarchy: list[Objective] = []
        self.path: str = working_path

    def get_objectives(self) -> list[Objective]:
        return self.hierarchy

    def get_objective_by_index(self, index: int) -> Objective:
        return self.hierarchy[index]

    def get_objective_by_name(self, objective_name: str) -> Objective:
        for obj in self.hierarchy:
            if obj.name == objective_name:
                return obj
        raise KeyError("Objective not found")

    def add_objective(self, name: str, weight: float, cell_size: float, crs: str, study_area: StudyArea) -> Objective:
        self.hierarchy.append(Objective(name, weight, cell_size, crs, study_area))
        return self.hierarchy[-1]

    def add_subobjective(self, parent_name: str, subobjective_name: str, weight: float) -> Objective:
        return self.get_objective_by_name(parent_name).add_subobjective(subobjective_name, weight)

    def add_continuous_attribute_to_subobjective(
        self,
        attribute_name,
        objective_name,
        subobjective_name,
        dataset_path,
        weight,
        scaling_function,
        missing_data_default_val,
        field_name=False,
    ) -> ContinuousFeature:
        input_path = os.path.join(self.path, dataset_path)
        output_name = "output.tiff"
        output_path = os.path.join(self.path, output_name)

        objective = self.get_objective_by_name(objective_name)
        subobjective = objective.get_subobjective_by_name(subobjective_name)
        return subobjective.add_continuous_attribute(
            attribute_name=attribute_name,
            path=input_path,
            output_tiff=output_path,
            weight=weight,
            scaling_function=scaling_function,
            missing_data_default_value=missing_data_default_val,
            field_name=field_name,
        )

    def add_categorical_attribute_to_subobjective(
        self,
        attribute_name,
        objective_name,
        subobjective_name,
        dataset_path,
        weight,
        scaling_function,
        missing_data_default_val,
        categories,
        categories_value,
        field_name,
    ) -> CategoricalFeature:
        input_path = os.path.join(self.path, dataset_path)
        output_name = "output.tiff"
        output_path = os.path.join(self.path, output_name)

        categories_dic = dict(zip(categories, categories_value))

        objective = self.get_objective_by_name(objective_name)
        subobjective = objective.get_subobjective_by_name(subobjective_name)
        return subobjective.add_categorical_attribute(
            file_name=attribute_name,
            path=input_path,
            output_tiff=output_path,
            weight=weight,
            scaling_function=scaling_function,
            missing_data_default_value=missing_data_default_val,
            categories=categories_dic,
            field_name=field_name,
        )

    def add_calculated_attribute_to_subobjective(
        self,
        attribute_name,
        objective_name,
        subobjective_name,
        dataset_path,
        weight,
        scaling_function,
        missing_data_default_val,
        max_distance,
        granularity=10,
        centroid=True,
        field_name=False,
    ) -> ContinuousFeature:
        input_path = os.path.join(self.path, dataset_path)
        output_name = "output.tiff"
        output_path = os.path.join(self.path, output_name)

        objective = self.get_objective_by_name(objective_name)
        subobjective = objective.get_subobjective_by_name(subobjective_name)
        return subobjective.add_distance_attribute(
            file_name=attribute_name,
            path=input_path,
            output_tiff=output_path,
            weight=weight,
            scaling_function=scaling_function,
            missing_data_default_value=missing_data_default_val,
            maximize_distance=True,
            max_distance=max_distance,
            centroid=centroid,
            granularity=granularity,
            threshold=0.8,
            field_name=field_name,
        )
