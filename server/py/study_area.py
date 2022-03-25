
import matplotlib.pyplot as plt
import py.raster_transform
from py.transformation import Transformation


class Study_area():
    def __init__(self, path, output_tiff, transformation: Transformation):
        self.path = path
        self.output_tiff = output_tiff
        self.transformation = transformation

    def update_path(self, path, output_tiff):
        self.path = path
        self.output_tiff = output_tiff
        self.update()

    def process_raster_as_array(self):
        file_band = self.as_raster.GetRasterBand(1)
        return file_band.ReadAsArray()

    def update(self):
        self.as_raster = py.raster_transform.process_raster(
            self.transformation, self.path, self.output_tiff)
        self.as_array = self.process_raster_as_array()
        self.origin = (self.as_raster.GetGeoTransform()[
            0], self.as_raster.GetGeoTransform()[3])

    def display_array(self):
        plt.figure()
        plt.imshow(self.as_array)
        plt.show()
