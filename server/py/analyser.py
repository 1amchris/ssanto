

import json
import matplotlib.pyplot as plt
from py.study_area import Study_area
import py.objective
from osgeo import gdal, ogr
from py.transformation import Transformation
import numpy as np
from osgeo.gdalconst import *
import rasterio
from rasterio.features import shapes
import geopandas as gp
import pandas as pd


class Analyser():
    def __init__(self, cellsize=200, crs="epsg:32188"):
        self.transformation = Transformation(cellsize, crs)
        self.objectives = {}
        self.study_area = Study_area("", "", self.transformation)

    def add_study_area(self, path, output_tiff):
        self.study_area.update_path(path, output_tiff)

    def add_objective(self, objective_name, weight):
        obj = py.objective.Objective(
            weight=weight, transformation=self.transformation, study_area=self.study_area)
        self.objectives[objective_name] = obj

    def update_transformation(self, cellsize=200, crs="epsg:3857"):
        self.transformation.cellsize = cellsize
        self.transformation.crs = crs
        self.study_area.update()

    def matrix_to_raster(self, matrix):
        matrix = np.int16(matrix)
        print("matrix_to_raster", type(matrix),
              type(matrix[0]), type(matrix[0][0]))
             
        study_area_path = self.study_area.output_tiff
        output_path = "temp/output.tif"
        inDs = gdal.Open(study_area_path)
        driver = inDs.GetDriver()
        outDs = driver.Create(
            output_path, len(matrix[0]), len(matrix), 1, GDT_Int16)
        # write the data
        outBand = outDs.GetRasterBand(1)
        outBand.WriteArray(matrix, 0, 0)

        # flush data to disk, set the NoData value and calculate stats
        outBand.FlushCache()
        outBand.SetNoDataValue(-99)

        # georeference the image and set the projection
        outDs.SetGeoTransform(inDs.GetGeoTransform())
        outDs.SetProjection(inDs.GetProjection())
        return output_path

    def tiff_to_geojson(self, tiff_path):
        data = rasterio.open(tiff_path).meta
        print("tiff_to_geojson", data)
        c = str(data['crs'])
        print('CRS', c)
        mask = None
        with rasterio.open(tiff_path) as src:
            image = src.read()  # first band
            image = np.int16(image)
            results = (
                {'properties': {'sutability': v}, 'geometry': s}
                for i, (s, v)
                in enumerate(
                    shapes(image, mask=mask, transform=data['transform'])))
            geoms = list(results)
            gpd_polygonized_raster = gp.GeoDataFrame.from_features(
                geoms, crs=c)
            #gpd_polygonized_raster = gpd_polygonized_raster[gpd_polygonized_raster['NDVI'] > 0]
            #gpd_polygonized_raster.to_file('temp/dataframe.geojson', driver='GeoJSON')

            # cs convertion
            gpd_polygonized_raster = gpd_polygonized_raster.to_crs(4326)
            gpd_polygonized_raster.to_file("temp/analysis.geojson")
            return(gpd_polygonized_raster.to_json())

    def process_data(self):
        output_matrix = []
        total_weight = 0
        for obj in self.objectives:
            data = self.objectives[obj].process_data()
            objective_weight = self.objectives[obj].weight
            if len(output_matrix) == 0:
                output_matrix = np.zeros(data.shape)
            output_matrix += data * objective_weight
            total_weight += objective_weight
        output_matrix = output_matrix / total_weight * 100
        path = self.matrix_to_raster(output_matrix)
        geo_json = self.tiff_to_geojson(path)
        return geo_json
