

import matplotlib.pyplot as plt
from study_area import Study_area
import objective
from osgeo import gdal, ogr
from transformation import Transformation
import numpy as np


class Analyser():
    def __init__(self, cellsize=200, crs="epsg:32188"):
        self.transformation = Transformation(cellsize, crs)
        self.objectives = {}
        self.study_area = Study_area("", "", self.transformation)

    def add_study_area(self, path, output_tiff):
        self.study_area.update_path(path, output_tiff)

    def add_objective(self, objective_name, weight):
        obj = objective.Objective(
            weight=weight, transformation=self.transformation, study_area=self.study_area)
        self.objectives[objective_name] = obj

    def update_transformation(self, cellsize=200, crs="epsg:32188"):
        self.transformation.cellsize = cellsize
        self.transformation.crs = crs
        self.study_area.update()

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
        return output_matrix


# analyser = Analyser()

# analyser.add_study_area(
#     "/home/philippd/Desktop/DataProcess/terre/terre_shp.shp", "output.tiff")

# analyser.add_objective("Bio", 50)
# analyser.objectives['Bio'].add_distance_field(1, "/home/philippd/Desktop/DataProcess/MadeShapeFile/airport/airport.shp",
#                                               "output.tiff", 20, True, 8000, centroid=False, granularity=20, threshold=0.1)

# analyser.add_objective("Eco", 10)
# analyser.objectives['Eco'].add_file(
#     2, "/home/philippd/Desktop/DataProcess/park/Espace_Vert.shp", "output.tiff", 10)

# analyser.update_transformation(cellsize=100)

# analyser.process_data()
