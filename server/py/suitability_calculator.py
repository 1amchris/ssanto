from .objective import Objective
from osgeo import gdal, osr
import numpy as np
from osgeo.gdalconst import *
import rasterio
from rasterio.features import shapes
import geopandas as gp
from .study_area import StudyArea
import os
from .raster_transform import convert_projection
import geopandas as gpd

from geojson import dump
from shapely.geometry import shape


class SuitabilityCalculator:
    def __init__(self, working_path):
        self.objectives = {}
        self.objectives_arrays_dict = {}
        self.missing_mask_dict = {}
        self.path = working_path
        self.cell_size = 20
        self.crs = "epsg:32188"
        self.output_matrix = None

    def get_informations_at(self, latitude, longitude):
        x, y = self.geo_coordinate_to_matrix_coordinate(latitude, longitude)
        cell_values = {}
        for key in self.objectives_arrays_dict:
            cell_values[key] = self.objectives_arrays_dict[key][y, x]
        print(self.get_missing(latitude, longitude))
        return cell_values

    def get_array(self):
        return self.output_matrix

    def get_missing(self, latitude, longitude):
        x, y = self.geo_coordinate_to_matrix_coordinate(latitude, longitude)
        missing_val = []
        for key in self.missing_mask_dict:
            if self.missing_mask_dict[key][y, x]:
                missing_val.append(key)
        return missing_val

    def geo_coordinate_to_matrix_coordinate(self, latitude, longitude):
        src = gdal.Open(os.path.join(self.path, "output_study_area.tiff"))
        ulx, _, _, uly, _, _ = src.GetGeoTransform()
        projection = osr.SpatialReference(wkt=src.GetProjection())
        target_epsg = int(projection.GetAttrValue("AUTHORITY", 1))

        x, y = convert_projection(4326, target_epsg, latitude, longitude)

        cx = int((x - ulx) // self.cell_size)
        cy = -int((y - uly) // self.cell_size)
        return cx, cy

    def set_cell_size(self, cell_size):
        self.cell_size = cell_size

    def set_crs(self, crs):  # "epsg:32188"?
        self.crs = crs

    def set_study_area_input(self, input):
        self.study_area = StudyArea(input)
        self.study_area.update(self.path, self.cell_size, self.crs)

    def add_objective(self, objective_name, weight):
        obj = Objective(objective_name, weight, self.cell_size,
                        self.crs, self.study_area)
        self.objectives[objective_name] = obj

    def add_file_to_objective(
        self,
        file_name,
        objective_name,
        id,
        input,
        weight,
        scaling_function,
        missing_data_default_val,
        field_name=False,
    ):
        input_path = os.path.join(self.path, input)
        output_name = "output.tiff"
        output_path = os.path.join(self.path, output_name)
        self.objectives[objective_name].add_file(
            id,
            file_name,
            input_path,
            output_path,
            weight,
            scaling_function,
            missing_data_default_val,
            field_name,
        )

    def add_file_to_categorical_objective(
        self,
        file_name,
        objective_name,
        id,
        input,
        weight,
        scaling_function,
        categories,
        categories_value,
        missing_data_default_val,
        field_name,
    ):
        input_path = os.path.join(self.path, input)
        output_name = "output.tiff"
        output_path = os.path.join(self.path, output_name)

        categories_dic = dict(zip(categories, categories_value))
        self.objectives[objective_name].add_categorical_file(
            id,
            file_name,
            input_path,
            output_path,
            weight,
            scaling_function,
            categories_dic,
            missing_data_default_val,
            field_name,
        )

    def add_file_to_calculated_objective(
        self,
        file_name,
        objective_name,
        id,
        input,
        weight,
        scaling_function,
        missing_data_default_val,
        max_distance,
        field_name=False,
    ):
        input_path = os.path.join(self.path, input)
        output_name = "output.tiff"
        output_path = os.path.join(self.path, output_name)
        self.objectives[objective_name].add_distance_file(
            id,
            file_name,
            input_path,
            output_path,
            weight,
            scaling_function,
            missing_data_default_val,
            maximize_distance=True,
            max_distance=max_distance,
            centroid=True,
            granularity=20,
            threshold=0.8,
            field_name=False,
        )

    # add calculated file to objective

    def matrix_to_raster(self, matrix):
        matrix = np.int16(matrix)
        study_area_path = os.path.join(self.path, StudyArea.OUTPUT_NAME)
        output_name = "output.tiff"
        output_path = os.path.join(self.path, output_name)

        inDs = gdal.Open(study_area_path)
        driver = inDs.GetDriver()
        outDs = driver.Create(output_path, len(
            matrix[0]), len(matrix), 1, GDT_Int16)
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

    def tiff_to_geojson(self, tiff_name):
        input_path = os.path.join(self.path, tiff_name)
        data = rasterio.open(input_path).meta
        c = str(data["crs"])
        mask = None
        with rasterio.open(input_path) as src:
            image = src.read()  # first band
            image = np.int16(image)
            results = (
                {"properties": {"sutability": v}, "geometry": s}
                for i, (s, v) in enumerate(shapes(image, mask=mask, transform=data["transform"]))
            )
            geoms = list(results)
            gpd_polygonized_raster = gp.GeoDataFrame.from_features(
                geoms, crs=c)
            # gpd_polygonized_raster = gpd_polygonized_raster[gpd_polygonized_raster['NDVI'] > 0]
            # gpd_polygonized_raster.to_file('temp/dataframe.geojson', driver='GeoJSON')

            # cs convertion
            gpd_polygonized_raster = gpd_polygonized_raster.to_crs(
                4326)  # Where these numbers come from?
            output_geojson_name = "analysis.geojson"
            gpd_polygonized_raster.to_file(
                os.path.join(self.path, output_geojson_name))
            return gpd_polygonized_raster

    def process_data(self):
        self.objectives_arrays_dict = {}
        self.missing_mask_dict = {}
        output_matrix = np.zeros(self.study_area.as_array.shape)
        total_weight = 0
        for obj in self.objectives:
            data, sub_objective_array_dict = self.objectives[obj].process_value_matrix(
            )
            partial_missing_mask_dict = self.objectives[obj].get_missing_mask()
            self.missing_mask_dict.update(partial_missing_mask_dict)
            objective_weight = self.objectives[obj].weight
            self.objectives_arrays_dict[self.objectives[obj].name] = data
            self.objectives_arrays_dict.update(sub_objective_array_dict)
            output_matrix += self.objectives_arrays_dict[self.objectives[obj].name]
            total_weight += objective_weight

        output_matrix = output_matrix / total_weight * 100
        mask = self.study_area.as_array == 0
        output_matrix[mask] = -1
        self.objectives_arrays_dict["ANALYSIS"] = output_matrix / 100
        path = self.matrix_to_raster(output_matrix)
        analysis_df = self.tiff_to_geojson(path)
        masked_analysis_df = analysis_df
        return masked_analysis_df.to_json()
