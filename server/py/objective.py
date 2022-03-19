from py.transformation import Transformation
from py.study_area import Study_area
import py.subobjective

import numpy as np


class Objective():
    def __init__(self, weight, transformation: Transformation, study_area: Study_area):
        self.files = {}
        self.weight = weight
        self.transformation = transformation
        self.study_area = study_area

    def add_file(self, id, path, output_tiff, weight, field_name=False):
        self.files[id] = py.subobjective.Continuous_subobjective(
            path, output_tiff, weight, self.transformation, self.study_area, field_name)

    def add_distance_field(self, id, path, output_tiff, weight, maximize_distance, max_distance, centroid, granularity, threshold=0.8, field_name=False,):
        self.files[id] = py.subobjective.Distance_subobjective(
            path, output_tiff, weight, max_distance, self.transformation, self.study_area, field_name, maximize_distance, centroid, granularity, threshold)

    def process_data(self):

        total_weight = 0
        for file in self.files:
            total_weight += self.files[file].weight
        output_array = np.zeros(self.study_area.as_array.shape)
        for file in self.files:
            self.files[file].update()
            output_array += self.files[file].get_value_matrix() * \
                self.files[file].weight/total_weight

        output_array = np.multiply(
            output_array, self.study_area.as_array)
        return output_array
