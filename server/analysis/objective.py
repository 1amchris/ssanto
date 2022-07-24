from __future__ import annotations

from analysis.study_area import StudyArea
from analysis.feature import ContinuousFeature, CategoricalFeature, DistanceFeature

import numpy as np


class Objective:
    def __init__(self, objective_name: str, weight: float, cell_size: float, crs: str, study_area: StudyArea):
        self.id = objective_name
        self.name = objective_name
        self.weight = weight

        self.cell_size = cell_size
        self.crs = crs
        self.study_area = study_area

        self.subobjectives = []
        self.missing_mask_dict = {}

    def get_subobjective_by_index(self, index) -> Objective:
        return self.subobjectives[index]

    def get_subobjective_by_name(self, name) -> Objective:
        for subobjective in self.subobjectives:
            if subobjective.name == name:
                return subobjective
        raise KeyError("Subobjective not found")

    def get_missing_mask(self):
        return self.missing_mask_dict

    def add_continuous_attribute(
        self,
        attribute_name,
        path,
        output_tiff,
        weight,
        scaling_function,
        missing_data_default_value,
        field_name=False,
    ) -> ContinuousFeature:
        self.subobjectives.append(
            ContinuousFeature(
                id=len(self.subobjectives),
                name=attribute_name,
                path=path,
                output_tiff=output_tiff,
                weight=weight,
                cell_size=self.cell_size,
                crs=self.crs,
                study_area=self.study_area,
                scaling_function=scaling_function,
                missing_data_default_val=missing_data_default_value,
                field_name=field_name,
            )
        )
        return self.subobjectives[-1]

    def add_categorical_attribute(
        self,
        file_name,
        path,
        output_tiff,
        weight,
        scaling_function,
        missing_data_default_value,
        categories,
        field_name=False,
    ) -> CategoricalFeature:
        """
        categories est un dict : {category: value}
        """
        self.subobjectives.append(
            CategoricalFeature(
                id=len(self.subobjectives),
                name=file_name,
                path=path,
                output_tiff=output_tiff,
                weight=weight,
                cell_size=self.cell_size,
                crs=self.crs,
                study_area=self.study_area,
                scaling_function=scaling_function,
                missing_data_default_val=missing_data_default_value,
                field_name=field_name,
                category_value_dict=categories,
            )
        )
        return self.subobjectives[-1]

    def add_distance_attribute(
        self,
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
    ) -> DistanceFeature:
        self.subobjectives.append(
            DistanceFeature(
                id=len(self.subobjectives),
                name=file_name,
                path=path,
                output_tiff=output_tiff,
                weight=weight,
                max_distance=max_distance,
                cell_size=self.cell_size,
                crs=self.crs,
                study_area=self.study_area,
                scaling_function=scaling_function,
                missing_data_default_val=missing_data_default_value,
                field_name=field_name,
                maximize_distance=maximize_distance,
                centroid=centroid,
                granularity=granularity,
                threshold=threshold,
            )
        )
        return self.subobjectives[-1]

    def add_subobjective(self, name, weight) -> Objective:
        self.subobjectives.append(Objective(name, weight, self.cell_size, self.crs, self.study_area))
        return self.subobjectives[-1]

    def process_value_matrix(self):
        total_weight = 0
        subobjective_arrays_dict = {}
        self.missing_mask_dict = {}
        output_array = np.zeros(self.study_area.as_array.shape)
        for subobjective in self.subobjectives:

            total_weight += subobjective.weight
            value_matrix, subsubobjective_arrays_dict = subobjective.process_value_matrix()

            subobjective_missing_mask = subobjective.get_missing_mask()

            subobjective_arrays_dict[subobjective.name] = value_matrix
            subobjective_arrays_dict.update(subsubobjective_arrays_dict)
            self.missing_mask_dict.update(subobjective_missing_mask)
            output_array += value_matrix * subobjective.weight

        output_array = output_array / total_weight
        output_array = np.multiply(output_array, self.study_area.as_array)
        return output_array, subobjective_arrays_dict
