from analysis.study_area import StudyArea
from analysis.feature import ContinuousFeature, CategoricalFeature, DistanceFeature

import numpy as np


class Objective:
    def __init__(self, objective_name, weight, cell_size, crs, study_area: StudyArea):
        self.name = objective_name
        self.id = objective_name
        self.subobjective = {}
        self.missing_mask_dict = {}
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
        missing_data_default_value,
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
            missing_data_default_value,
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
        missing_data_default_value,
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
            missing_data_default_value,
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
        missing_data_default_value,
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
            missing_data_default_value,
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
        self.missing_mask_dict = {}
        output_array = np.zeros(self.study_area.as_array.shape)
        for file in self.subobjective:

            total_weight += self.subobjective[file].weight
            value_matrix, subsubobjective_arrays_dict = self.subobjective[
                file
            ].process_value_matrix()

            subobjective_missing_mask = self.subobjective[file].get_missing_mask()

            subobjective_arrays_dict[self.subobjective[file].name] = value_matrix
            subobjective_arrays_dict.update(subsubobjective_arrays_dict)
            self.missing_mask_dict.update(subobjective_missing_mask)
            output_array += value_matrix * self.subobjective[file].weight

        output_array = output_array / total_weight
        output_array = np.multiply(output_array, self.study_area.as_array)
        return output_array, subobjective_arrays_dict

    def get_missing_mask(self):
        return self.missing_mask_dict
