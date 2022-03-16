import matplotlib.pyplot as plt
from osgeo import gdal, ogr
from py.file_processing import *


class Driver():
    def __init__(self):
        self.input_driver = ogr.GetDriverByName("ESRI Shapefile")
        self.output_driver = gdal.GetDriverByName("GTiff")


class Objective():
    def __init__(self, cellsize=200, weight=1):
        self.study_area = None
        self.files = {}
        self.driver = Driver()
        self.crs = "epsg:32188"
        self.cellsize = cellsize
        self.weight = weight

    def add_study_area(self, path, output_tiff):
        self.study_area = Study_area_file(path,
                                          output_tiff, self.cellsize, self.driver, self.crs)

        for file in self.files:
            self.files[file].update_study_area(self.study_area)

    def add_file(self, id, path, output_tiff, weight, field_name=False):
        self.files[id] = Objective_file(
            path, output_tiff, weight, self.cellsize, self.driver, self.crs, self.study_area, field_name)

    def add_distance_field(self, id, path, output_tiff, weight, maximize_distance, max_distance, centroid, granularity, threshold=0.8, field_name=False,):
        self.files[id] = Distance_file(
            path, output_tiff, weight, self.cellsize, self.driver, self.crs, self.study_area, max_distance, field_name, maximize_distance, centroid, granularity, threshold)

    def process_data(self):
        total_weight = 0
        for file in self.files:
            total_weight += self.files[file].weight
        output_array = np.zeros(self.study_area.as_array.shape)
        for file in self.files:
            output_array += self.files[file].get_value_matrix() * \
                self.files[file].weight/total_weight

        output_array = np.multiply(output_array, self.study_area.as_array)
        return output_array

    def update_files(self):
        if self.study_area != None:
            self.study_area.cellsize = self.cellsize
            self.study_area.crs = self.crs
            self.study_area.update()
            for file in self.files:
                self.files[file].update_study_area(self.study_area)

    def update_cellsize(self, cell_size):
        self.cellsize = cell_size
        self.update_files()

    def update_crs(self, crs):
        self.crs = crs
        self.update_files()
