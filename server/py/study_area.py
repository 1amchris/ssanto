
import os
import matplotlib.pyplot as plt
from py.raster_transform import process_raster
from .file_manager import FileParser
import fiona


class StudyArea():
    OUTPUT_NAME = "output_study_area.tiff"

    def __init__(self, input_file_name, files_manager):
        self.input = input_file_name
        self.files_manager = files_manager

    def process_raster_as_array(self):
        file_band = self.as_raster.GetRasterBand(1)
        return file_band.ReadAsArray()

    def update(self, path, cell_size, crs):
        input_path = os.path.join(path, self.input)
        output_path = os.path.join(path, StudyArea.OUTPUT_NAME)

        self.as_raster = process_raster(
            cell_size, crs, input_path, output_path)
        self.as_array = self.process_raster_as_array()
        self.origin = (self.as_raster.GetGeoTransform()[
                       0], self.as_raster.GetGeoTransform()[3])
        # We need the study area in geojson to mask the output analysis
        self.geojson = FileParser.load_by_name(self.files_manager, self.input)
        self.crs = self.get_crs(path)

    def get_crs(self, path):
        c = fiona.open(os.path.join(path, self.input))
        return c.crs["init"]

    def display_array(self):
        plt.figure()
        plt.imshow(self.as_array)
        plt.show()
