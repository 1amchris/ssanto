from __future__ import annotations
import numpy as np

from analysis.study_area import StudyArea
from analysis.feature import ContinuousFeature, CategoricalFeature, DistanceFeature


class Objective:
    def __init__(
        self, objective_name: str, weight: float, cell_size: float, crs: str, study_area: StudyArea, root_id=""
    ):
        self.id: str = f"{root_id}{'.' if root_id else ''}{objective_name}"
        self.name: str = objective_name
        self.weight: float = weight

        self.cell_size: float = cell_size
        self.crs: str = crs
        self.study_area: StudyArea = study_area

        self.subobjectives: list[Objective] = []
        self.missing_mask_dict = {}

    def __str__(self) -> str:
        return f"{self.id} [{len(self.subobjectives)}]: [{', '.join([str(o) for o in self.subobjectives])}]"

    def get_subobjective_by_index(self, index: int) -> Objective:
        return self.subobjectives[index]

    def get_subobjective_by_id(self, id: str) -> Objective:
        if self.id == id:
            return self

        elif id.startswith(self.id):
            index = int(id[len(self.id) + 1 :].split(".")[0])
            if index < len(self.subobjectives):
                return self.subobjectives[index].get_subobjective_by_id(id)

        raise KeyError(f"Subobjective {id} not found")

    def get_missing_mask(self):
        return self.missing_mask_dict

    def add_continuous_attribute(
        self,
        name,
        dataset_path,
        output_tiff,
        weight,
        scaling_function,
        missing_data_default_value,
        field_name=False,
    ) -> ContinuousFeature:
        self.subobjectives.append(
            ContinuousFeature(
                id=f"{self.id}.{len(self.subobjectives)}.{name}",
                name=name,
                dataset_path=dataset_path,
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
        name,
        dataset_path,
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
                id=f"{self.id}.{len(self.subobjectives)}.{name}",
                name=name,
                dataset_path=dataset_path,
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
        name,
        dataset_path,
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
                id=f"{self.id}.{len(self.subobjectives)}.{name}",
                name=name,
                dataset_path=dataset_path,
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
        root_id = f"{self.id}.{len(self.subobjectives)}"
        self.subobjectives.append(Objective(name, weight, self.cell_size, self.crs, self.study_area, root_id=root_id))
        return self.subobjectives[-1]

    def process_value_matrix(self):
        objective_arrays_dict = {}
        self.missing_mask_dict = {}
        output_matrix = np.zeros(self.study_area.as_array.shape)
        total_weight = 0
        for objective in self.subobjectives:
            value_matrix, subobjective_arrays_dict = objective.process_value_matrix()
            self.missing_mask_dict.update(objective.get_missing_mask())
            objective_arrays_dict[objective.id] = value_matrix
            objective_arrays_dict.update(subobjective_arrays_dict)
            output_matrix += objective_arrays_dict[objective.id] * objective.weight
            total_weight += objective.weight

        output_matrix /= total_weight
        output_matrix = np.multiply(output_matrix, self.study_area.as_array)
        return output_matrix, objective_arrays_dict
