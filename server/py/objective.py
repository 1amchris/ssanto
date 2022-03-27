
from py.study_area import StudyArea
from py.subobjective import ContinuousFeature, DistanceFeature

import numpy as np


class Objective():
    def __init__(self, weight, cell_size, crs, study_area: StudyArea):
        self.subobjective = {}
        self.weight = weight
        self.cell_size = cell_size
        self.crs = crs
        self.study_area = study_area

    def add_file(self, id, path, output_tiff, weight, scaling_function, field_name=False):
        self.subobjective[id] = ContinuousFeature(
            path, output_tiff, weight, self.cell_size, self.crs, self.study_area, field_name)

    def add_distance_file(self, id, path, output_tiff, weight, scaling_function, maximize_distance, max_distance, centroid, granularity, threshold=0.8, field_name=False,):
        self.subobjective[id] = DistanceFeature(
            path, output_tiff, weight, max_distance, self.cell_size, self.crs, self.study_area, field_name, maximize_distance, centroid, granularity, threshold)

    def add_subobjective(self, id, weight):
        new_objective = Objective(weight, self.cell_size, self.crs, self.study_area)
        self.subobjective[id] = new_objective

    def process_value_matrix(self):
        total_weight = 0

        output_array = np.zeros(self.study_area.as_array.shape)
        for file in self.subobjective:
            total_weight += self.subobjective[file].weight
            value_matrix = self.subobjective[file].process_value_matrix()
            output_array += value_matrix * \
                self.subobjective[file].weight
        output_array/total_weight

        output_array = np.multiply(
            output_array, self.study_area.as_array)
        return output_array
