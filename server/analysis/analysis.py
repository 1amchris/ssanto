from uuid import uuid4

from analysis.raster_transform import *
from analysis.study_area import StudyArea
from analysis.suitability_calculator import ObjectiveHierarchyBuilder, SuitabilityCalculator
from documents.utils import uri_to_path
from logger.manager import LogsManager
from singleton import TenantInstance, TenantSingleton
from subjects.manager import SubjectsManager
from workspace.manager import WorkspaceManager


class Analysis(TenantInstance, metaclass=TenantSingleton):
    DEFAULT_IS_CALCULATED = True
    DEFAULT_COLUMN_NAME = ""
    DEFAULT_WEIGHT = 1
    DEFAULT_SCALING_FUNCTION = "x"
    DEFAULT_MISSING_DATA = 0
    DEFAULT_GRANULARITY = 1
    DEFAULT_CENTROID = False
    DEFAULT_MAX_SCALING_DISTANCE = 100
    DEFAULT_DATASET_TYPE = "Continuous"

    def __init__(self, tenant_id: str):
        super().__init__(tenant_id)
        self.subjects_manager = SubjectsManager(tenant_id)
        self.logger = LogsManager(tenant_id)
        self.workspace = WorkspaceManager(tenant_id)

        # suitability categories: ([0-10[, [10-20[, [20-30[, [30-40[, [40-50[, [50-60[, [60-70[, [70-80[, [80-90[, [90-100]) or None
        # self.suitability_categories = subjects_manager.create("analysis.visualization.suitability_categories", None)

        # suitability : [0, 100] or None
        # self.suitability_threshold = subjects_manager.create("analysis.visualization.suitability_threshold", 50)
        # self.suitability_above_threshold = subjects_manager.create(
        #     "analysis.visualization.suitability_above_threshold", None
        # )

        self.logger.info("[Analysis] initialized.")

    # def update_suitability_threshold(self, value):
    #     self.suitability_threshold.notify(value)
    #     self.compute_suitability_above_threshold()

    # def compute_suitability_categories(self):
    #     if self.suitability_calculator is not None and (array := self.suitability_calculator.get_array()).any():
    #         study_area = self.suitability_calculator.get_study_area()
    #         self.suitability_categories.notify(
    #             {
    #                 "00-10%": 1 - GraphMaker.compute_fraction_above_threshold(study_area, array, 10),
    #                 "10-20%": GraphMaker.compute_fraction_in_range(study_area, array, 10, 20),
    #                 "20-30%": GraphMaker.compute_fraction_in_range(study_area, array, 20, 30),
    #                 "30-40%": GraphMaker.compute_fraction_in_range(study_area, array, 30, 40),
    #                 "40-50%": GraphMaker.compute_fraction_in_range(study_area, array, 40, 50),
    #                 "50-60%": GraphMaker.compute_fraction_in_range(study_area, array, 50, 60),
    #                 "60-70%": GraphMaker.compute_fraction_in_range(study_area, array, 60, 70),
    #                 "70-80%": GraphMaker.compute_fraction_in_range(study_area, array, 70, 80),
    #                 "80-90%": GraphMaker.compute_fraction_in_range(study_area, array, 80, 90),
    #                 "90-100%": GraphMaker.compute_fraction_above_threshold(study_area, array, 90),
    #             }
    #         )
    #     else:
    #         self.suitability_categories.notify(None)

    # def compute_suitability_above_threshold(self):
    #     if (
    #         self.suitability_calculator is not None
    #         and (array := self.suitability_calculator.get_array()).any()
    #         and (threshold := self.suitability_threshold.value()) is not None
    #     ):
    #         self.suitability_above_threshold.notify(
    #             GraphMaker.compute_fraction_above_threshold(
    #                 self.suitability_calculator.study_area,
    #                 array,
    #                 min(100, max(0, threshold)),
    #             )
    #         )
    #     else:
    #         self.suitability_above_threshold.notify(None)

    # def get_informations_at_position(self, cursor: LatLng) -> MapCursorInformations:
    #     base = MapCursorInformations()
    #     if calculator := self.suitability_calculator:
    #         base.objectives = calculator.get_informations_at(cursor.lat, cursor.long)
    #     return base

    # def export_tiff(self, layer):
    #     if layer in self.tiffs:
    #         return {
    #             "name": f"{layer}.{self.__get_project_name()}.tiff",
    #             "content": b64encode(self.tiffs[layer]).decode("utf-8"),
    #         }
    #     else:
    #         raise CallException("There are no existing tiff with this name")

    async def compute_suitability(self, cell_size, raw_objectives, study_area_path):
        id = str(uuid4())
        self.logger.info(f"[Analysis] Starting analysis for {'needs'}: {id}")

        working_dir = self.workspace.get_workspace_path()
        if study_area_path is None or working_dir is None:
            return_value = {}

        else:
            crs = "epsg:3857"
            study_area = StudyArea(study_area_path)
            study_area.update(working_dir=working_dir, cell_size=cell_size, crs=crs)
            builder = ObjectiveHierarchyBuilder(
                working_dir, main="needs", cell_size=cell_size, crs=crs, study_area=study_area
            )
            for primary in raw_objectives["primaries"]:
                objective = builder.add_objective(name=primary["name"], weight=float(primary["weight"]))

                for secondary in primary["secondaries"]:
                    subobjective = builder.add_objective(
                        parent_id=objective.id, name=secondary["name"], weight=float(secondary["weight"])
                    )

                    for attribute in secondary["attributes"]:
                        dataset_path = uri_to_path(attribute["dataset"]["uri"])
                        weight = float(attribute["weight"]) if "weight" in attribute else Analysis.DEFAULT_WEIGHT
                        column_type = (
                            attribute["dataset"]["type"]
                            if "type" in attribute["dataset"]
                            else Analysis.DEFAULT_DATASET_TYPE
                        )
                        column_name = (
                            attribute["dataset"]["column"]
                            if "column" in attribute["dataset"]
                            else Analysis.DEFAULT_COLUMN_NAME
                        )
                        is_calculated = (
                            not bool(attribute["dataset"]["column"])
                            if "column" in attribute["dataset"]
                            else Analysis.DEFAULT_IS_CALCULATED
                        )
                        scaling_function = (
                            attribute["scale"]["function"]
                            if "function" in attribute["scale"]
                            else Analysis.DEFAULT_SCALING_FUNCTION
                        )
                        missing_data_default_value = (
                            attribute["scale"]["defaultValue"]
                            if "defaultValue" in attribute["scale"]
                            else Analysis.DEFAULT_MISSING_DATA
                        )
                        granularity = (
                            int(attribute["scale"]["granularity"])
                            if "granularity" in attribute["scale"]
                            else Analysis.DEFAULT_GRANULARITY
                        )
                        centroid = (
                            bool(attribute["scale"]["centroid"])
                            if "centroid" in attribute["scale"]
                            else Analysis.DEFAULT_CENTROID
                        )
                        max_scaling_distance = (
                            attribute["scale"]["max"]
                            if "max" in attribute["scale"]
                            else Analysis.DEFAULT_MAX_SCALING_DISTANCE
                        )
                        minimum = 0  # dataset["min_value"]
                        maximum = 1  # dataset["max_value"]
                        if column_type != "Categorical":
                            missing_data_default_value = missing_data_default_value * (maximum - minimum) + minimum

                        if not is_calculated and column_type == "Boolean":
                            builder.add_continuous_attribute_to_subobjective(
                                parent_id=subobjective.id,
                                attribute_name=attribute["name"],
                                dataset_path=dataset_path,
                                weight=weight,
                                scaling_function=scaling_function,
                                missing_data_default_value=missing_data_default_value,
                            )

                        elif is_calculated and column_type == "Boolean":
                            builder.add_calculated_attribute_to_subobjective(
                                parent_id=subobjective.id,
                                attribute_name=attribute["name"],
                                dataset_path=dataset_path,
                                weight=weight,
                                scaling_function=scaling_function,
                                missing_data_default_value=missing_data_default_value,
                                max_distance=max_scaling_distance,
                                granularity=granularity,
                                centroid=centroid,
                            )

                        elif column_type == "Categorical":
                            categories = {}
                            # categories = dict(
                            #     zip(dataset["properties"]["distribution"], dataset["properties"]["distribution_value"])
                            # )

                            builder.add_categorical_attribute_to_subobjective(
                                parent_id=subobjective.id,
                                attribute_name=attribute["name"],
                                dataset_path=dataset_path,
                                weight=weight,
                                scaling_function=scaling_function,
                                missing_data_default_value=missing_data_default_value,
                                categories=categories,
                                field_name=column_name,
                            )

                        else:
                            builder.add_continuous_attribute_to_subobjective(
                                parent_id=subobjective.id,
                                attribute_name=attribute["name"],
                                dataset_path=dataset_path,
                                weight=weight,
                                scaling_function=scaling_function,
                                missing_data_default_value=missing_data_default_value,
                                field_name=column_name,
                            )

            self.suitability_calculator = SuitabilityCalculator(working_dir)
            self.suitability_calculator.set_cell_size(cell_size)
            self.suitability_calculator.set_study_area_input(path=study_area_path, crs=crs)

            self.suitability_calculator.run(hierarchy=builder.get_objectives())

            # self.compute_suitability_above_threshold()
            # self.compute_suitability_categories()

            return_value = self.suitability_calculator.to_geojson()

        self.logger.info(f"[Analysis] Completed: {id}")
        return return_value
