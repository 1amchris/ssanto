from py.study_area import StudyArea
from py.feature import ContinuousFeature, CategoricalFeature, DistanceFeature

import numpy as np


class Objective:
    def __init__(self, objective_name, weight, cell_size, crs, study_area: StudyArea):
        self.name = objective_name
        self.id = objective_name
        self.subobjective = {}
        self.weight = weight
        self.cell_size = cell_size
        self.crs = crs
        self.study_area = study_area

    def add_file(
        self,
        id,
        file_name,
        path,
        output_tiff,
        weight,
        scaling_function,
        field_name=False,
    ):
        self.subobjective[id] = ContinuousFeature(
            id,
            file_name,
            path,
            output_tiff,
            weight,
            self.cell_size,
            self.crs,
            self.study_area,
            scaling_function,
            field_name,
        )

    # TODO
    def add_categorical_file(
        self,
        id,
        file_name,
        path,
        output_tiff,
        weight,
        scaling_function,
        categories,
        field_name=False,
    ):
        """
        categories est un dict : {category: value}
        """
        self.subobjective[id] = CategoricalFeature(
            id,
            file_name,
            path,
            output_tiff,
            weight,
            self.cell_size,
            self.crs,
            self.study_area,
            scaling_function,
            field_name,
            categories,
        )

    def add_distance_file(
        self,
        id,
        file_name,
        path,
        output_tiff,
        weight,
        scaling_function,
        maximize_distance,
        max_distance,
        centroid,
        granularity,
        threshold=0.8,
        field_name=False,
    ):
        self.subobjective[id] = DistanceFeature(
            id,
            file_name,
            path,
            output_tiff,
            weight,
            max_distance,
            self.cell_size,
            self.crs,
            self.study_area,
            scaling_function,
            field_name,
            maximize_distance,
            centroid,
            granularity,
            threshold,
        )

    def add_subobjective(self, name, id, weight):
        new_objective = Objective(
            name, weight, self.cell_size, self.crs, self.study_area
        )
        self.subobjective[id] = new_objective

    def process_value_matrix(self):
        total_weight = 0
        subobjective_arrays_dict = {}
        output_array = np.zeros(self.study_area.as_array.shape)
        for file in self.subobjective:

            total_weight += self.subobjective[file].weight
            value_matrix, subsubobjective_arrays_dict = self.subobjective[
                file
            ].process_value_matrix()
            subobjective_arrays_dict[self.subobjective[file].name] = (
                value_matrix * self.subobjective[file].weight
            )
            subobjective_arrays_dict.update(subsubobjective_arrays_dict)
            subobjective_arrays_dict[self.subobjective[file].name] = value_matrix
            output_array += value_matrix * self.subobjective[file].weight

        output_array = output_array / total_weight
        output_array = np.multiply(output_array, self.study_area.as_array)
        return output_array, subobjective_arrays_dict
