import json
from lib2to3.pytree import convert
import matplotlib.pyplot as plt
from .objective import Objective
from osgeo import gdal, ogr, osr
import numpy as np
from osgeo.gdalconst import *
import rasterio
from rasterio.features import shapes
import geopandas as gp
import pandas as pd
from .study_area import StudyArea
import os


class SuitabilityCalculator:
    def __init__(self, working_path):
        self.objectives = {}
        self.objectives_arrays_dict = {}
        self.path = working_path
        self.cell_size = 20
        self.crs = "epsg:32188"

    def git(self, latitude, longitude):
        x, y = self.geo_coordinate_to_matrix_coordinate(latitude, longitude)
        cell_values = {}
        for key in self.objectives_arrays_dict:
            cell_values[key] = self.objectives_arrays_dict[key][x, y]
        return cell_values

    def convert_projection(self, in_proj, out_proj, p1, p2):
        InSR = osr.SpatialReference()
        InSR.ImportFromEPSG(in_proj)
        OutSR = osr.SpatialReference()

        OutSR.ImportFromEPSG(out_proj)

        Point = ogr.Geometry(ogr.wkbPoint)
        Point.AddPoint(p1, p2)
        Point.AssignSpatialReference(InSR)
        Point.TransformTo(OutSR)

        x = Point.GetX()
        y = Point.GetY()
        return x, y

    def geo_coordinate_to_matrix_coordinate(self, latitude, longitude):
        src = gdal.Open(os.path.join(self.path, "output_study_area.tiff"))
        ulx, _, _, uly, _, _ = src.GetGeoTransform()
        projection = osr.SpatialReference(wkt=src.GetProjection())
        target_epsg = int(projection.GetAttrValue("AUTHORITY", 1))

        x, y = self.convert_projection(4326, target_epsg, latitude, longitude)

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
        obj = Objective(
            objective_name, weight, self.cell_size, self.crs, self.study_area
        )
        self.objectives[objective_name] = obj

    def add_file_to_objective(
        self, objective_name, id, input, weight, scaling_function, field_name=False
    ):
        input_path = os.path.join(self.path, input)
        output_name = "output.tiff"
        output_path = os.path.join(self.path, output_name)
        self.objectives[objective_name].add_file(
            id, input_path, output_path, weight, scaling_function, field_name
        )

    def add_file_to_categorical_objective(
        self, objective_name, id, input, weight, scaling_function, categories, categories_value, field_name
    ):
        input_path = os.path.join(self.path, input)
        output_name = "output.tiff"
        output_path = os.path.join(self.path, output_name)

        categories_dic = dict(zip(categories, categories_value))
        print('categories_dic', categories_dic)

        self.objectives[objective_name].add_categorical_file(
            id, input_path, output_path, weight, scaling_function, categories_dic, field_name
        )

    def add_file_to_calculated_objective(
        self, objective_name, id, input, weight, scaling_function, max_distance, field_name=False
    ):
        input_path = os.path.join(self.path, input)
        print("input_path", input_path)

        output_name = "output.tiff"
        output_path = os.path.join(self.path, output_name)
        self.objectives[objective_name].add_distance_file(
            id, input_path, output_path, weight, scaling_function, maximize_distance=True,
            max_distance=max_distance,
            centroid=False,
            granularity=None,
            threshold=0.8,
            field_name=field_name,
        )

    # add calculated file to objective

    def matrix_to_raster(self, matrix):
        matrix = np.int16(matrix)
        print("matrix_to_raster", type(matrix),
              type(matrix[0]), type(matrix[0][0]))

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
        print("tiff_to_geojson", data)
        c = str(data["crs"])
        print("CRS", c)
        mask = None
        with rasterio.open(input_path) as src:
            image = src.read()  # first band
            image = np.int16(image)
            results = (
                {"properties": {"sutability": v}, "geometry": s}
                for i, (s, v) in enumerate(
                    shapes(image, mask=mask, transform=data["transform"])
                )
            )
            geoms = list(results)
            gpd_polygonized_raster = gp.GeoDataFrame.from_features(
                geoms, crs=c)
            # gpd_polygonized_raster = gpd_polygonized_raster[gpd_polygonized_raster['NDVI'] > 0]
            # gpd_polygonized_raster.to_file('temp/dataframe.geojson', driver='GeoJSON')

            # cs convertion
            gpd_polygonized_raster = gpd_polygonized_raster.to_crs(
                4326
            )  # Where these numbers come from?
            output_geojson_name = "analysis.geojson"
            gpd_polygonized_raster.to_file(
                os.path.join(self.path, output_geojson_name))
            return gpd_polygonized_raster.to_json()

    def process_data(self):
        self.objectives_arrays_dict = {}
        output_matrix = []
        total_weight = 0
        for obj in self.objectives:
            data, sub_objective_array_dict = self.objectives[obj].process_value_matrix(
            )
            objective_weight = self.objectives[obj].weight
            if len(output_matrix) == 0:
                output_matrix = np.zeros(data.shape)
            self.objectives_arrays_dict[self.objectives[obj].id] = (
                data * objective_weight
            )
            self.objectives_arrays_dict.update(sub_objective_array_dict)
            output_matrix += self.objectives_arrays_dict[self.objectives[obj].id]
            total_weight += objective_weight
        for obj in self.objectives_arrays_dict:
            self.objectives_arrays_dict[obj] /= total_weight

        output_matrix = output_matrix / total_weight * 100
        self.objectives_arrays_dict["ANALYSIS"] = output_matrix
        path = self.matrix_to_raster(output_matrix)
        geo_json = self.tiff_to_geojson(path)
        return geo_json
