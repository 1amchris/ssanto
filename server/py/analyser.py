

import matplotlib.pyplot as plt
from py.study_area import Study_area
import py.objective
from osgeo import gdal, ogr
from py.transformation import Transformation
import numpy as np
from osgeo.gdalconst import *


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

    def update_transformation(self, cellsize=200, crs="epsg:32188"):
        self.transformation.cellsize = cellsize
        self.transformation.crs = crs
        self.study_area.update()

    def matrix_to_raster(self, matrix):
        inDs = gdal.Open("temp/output_study_area.tiff")
        driver = inDs.GetDriver()
        outDs = driver.Create(
            "temp/output.tif", len(matrix[0]), len(matrix), 1, GDT_Int32)
        # write the data
        outBand = outDs.GetRasterBand(1)
        outBand.WriteArray(matrix, 0, 0)

        # flush data to disk, set the NoData value and calculate stats
        outBand.FlushCache()
        outBand.SetNoDataValue(-99)

        # georeference the image and set the projection
        outDs.SetGeoTransform(inDs.GetGeoTransform())
        outDs.SetProjection(inDs.GetProjection())

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
        output_matrix = output_matrix / total_weight
        plt.figure()
        plt.imshow(output_matrix)
        plt.show()
        plt.savefig('test_map.png')
        print(output_matrix)
        self.matrix_to_raster(output_matrix)
        return output_matrix
