import os
from files.serializable import Serializable
from analysis.suitability_calculator import SuitabilityCalculator
from analysis.hierarchy import Hierarchy
from .map import LatLng, MapCursorInformations
from base64 import b64encode, b64decode
import copy
import pickle
import json

from .graph_maker import GraphMaker
from .raster_transform import *

from network.server_socket import CallException


class Analysis(Serializable):
    @staticmethod
    def __export(filename, content):
        return {
            "name": filename,
            "content": b64encode(pickle.dumps(content)).decode("utf-8"),
        }

    @staticmethod
    def __import(content):
        return json.loads(pickle.loads(b64decode(content.encode("utf-8"))))

    def __init__(self, subjects_manager, files_manager):
        self.subjects_manager = subjects_manager
        self.files_manager = files_manager
        self.suitability_calculator = None
        self.hierarchy = Hierarchy(os.path.join(os.path.join(
            os.getcwd(), "objectives_data"), "hierarchy.json"))

        self.parameters = subjects_manager.create(
            "parameters",
            {
                "analysis_name": "",
                "modeler_name": "",
                "cell_size": 20,
            },
        )

        self.study_area = subjects_manager.create("study_area", "")

        self.nbs = subjects_manager.create(
            "nbs_system",
            {
                "system_type": "2",
                # ...
            },
        )

        self.objectives_data = subjects_manager.create(
            "objectives_data",
            {
                'name': 'ObjectivesHierarchy',
                'mains': []
            },
        )

        self.objectives = subjects_manager.create(
            "objectives",
            {
                "main": "Needs",
                "primaries": {"primary": [], "weights": [], "secondaries": []}
                # ...
            },
        )
        self.objectives_data_update()

        self.suggested_map_center = subjects_manager.create(
            # "map.center", LatLng(45.56, -76.9))
            "map.center",
            LatLng(51.511906, -0.122520),
        )

        self.value_scaling = subjects_manager.create(
            "value_scaling",
            [],
        )

        self.layers = subjects_manager.create("layers", {})

        self.analysis = subjects_manager.create("analysis", {})
        self.sub_analysis = subjects_manager.create("sub_analysis", [])

        # suitability categories: ([0-10[, [10-20[, [20-30[, [30-40[, [40-50[, [50-60[, [60-70[, [70-80[, [80-90[, [90-100]) or None
        self.suitability_categories = subjects_manager.create(
            "analysis.visualization.suitability_categories", None)

        # suitability : [0, 100] or None
        self.suitability_threshold = subjects_manager.create(
            "analysis.visualization.suitability_threshold", 50)
        self.suitability_above_threshold = subjects_manager.create(
            "analysis.visualization.suitability_above_threshold", None
        )

    def __repr__(self) -> str:
        return json.dumps(self.serialize())

    def update_suitability_threshold(self, value):
        self.suitability_threshold.notify(value)
        self.compute_suitability_above_threshold()

    def compute_suitability_categories(self):
        if self.suitability_calculator is not None and (array := self.suitability_calculator.get_array()).any():
            study_area = self.suitability_calculator.get_study_area()
            self.suitability_categories.notify(
                {
                    "00-10%": 1 - GraphMaker.compute_fraction_above_threshold(study_area, array, 10),
                    "10-20%": GraphMaker.compute_fraction_in_range(study_area, array, 10, 20),
                    "20-30%": GraphMaker.compute_fraction_in_range(study_area, array, 20, 30),
                    "30-40%": GraphMaker.compute_fraction_in_range(study_area, array, 30, 40),
                    "40-50%": GraphMaker.compute_fraction_in_range(study_area, array, 40, 50),
                    "50-60%": GraphMaker.compute_fraction_in_range(study_area, array, 50, 60),
                    "60-70%": GraphMaker.compute_fraction_in_range(study_area, array, 60, 70),
                    "70-80%": GraphMaker.compute_fraction_in_range(study_area, array, 70, 80),
                    "80-90%": GraphMaker.compute_fraction_in_range(study_area, array, 80, 90),
                    "90-100%": GraphMaker.compute_fraction_above_threshold(study_area, array, 90),
                }
            )
        else:
            self.suitability_categories.notify(None)

    def compute_suitability_above_threshold(self):
        if (
            self.suitability_calculator is not None
            and (array := self.suitability_calculator.get_array()).any()
            and (threshold := self.suitability_threshold.value()) is not None
        ):
            self.suitability_above_threshold.notify(
                GraphMaker.compute_fraction_above_threshold(
                    self.suitability_calculator.study_area,
                    array,
                    min(100, max(0, threshold)),
                )
            )
        else:
            self.suitability_above_threshold.notify(None)

    def serialize(self) -> dict:
        return {
            "analysis": {
                "parameters": self.parameters.value(),
                "study_area": self.study_area.value(),
                "nbs": self.nbs.value(),
                "objectives": self.objectives.value(),
                "value_scaling": self.value_scaling.value(),
                "layers": self.layers.value(),
                # We dont had the analysis, but we could
            },
            "files": self.files_manager.serialize(),
        }

    def __get_project_name(self):
        # by default, the name is "analysis.ssanto", unless a name was specified by the user
        parameters = self.parameters.value()
        return parameters["analysis_name"] if "analysis_name" in parameters else "analysis"

    """
    There is an exemple of method to be implemented as a bind command
    and how to use subjects
    def perform_analysis(self):
        # self.parameters.value().get('analysis_name')
        # ...
        # some change to the data
        # ...
        # self.parameters.update()
        pass
    """

    def add_files(self, *files):
        error_msg = ""
        added, rejected, invalided = self.files_manager.add_files(*files)
        for shapefile in added:
            self.add_layer("normal", shapefile.name)
        
        if len(rejected) > 0:
            error_msg += "The following shapefiles were incomplete: " 
            error_msg += ", ".join(rejected)
            error_msg += ". You must at least have a '.shp', '.shx', '.dbf' and a '.prj'. "

        if len(invalided) > 0:
            error_msg += "The following files were not accepted: " 
            error_msg += ", ".join(invalided)
            error_msg += ". Only the shapefile format is accepted. "

        if len(rejected) > 0 or len(invalided) > 0:
            raise CallException(error_msg)
        

    def remove_file(self, name):
        popped_file = self.files_manager.remove_file(name)
        if self.study_area.value() == popped_file.name:
            self.study_area.notify("")
        self.remove_layer(name)

    def add_layer(self, group, name):
        layers = self.layers.value()
        layers.setdefault(group, []).append(name)
        self.layers.notify(layers)

    def remove_layer(self, name):
        layers = self.layers.value()
        for group in layers:
            if name in group:
                break
        layers[group].remove(name)
        if len(layers[group]) == 0:
            layers.pop(group)
        self.layers.notify(layers)

    def get_layer(self, group, name):
        geojson = json.loads(self.files_manager.get_file(name).read_content())
        return {"group": group, "name": name, "geojson": geojson}

    def objectives_data_update(self):
        new_hierarchy = self.hierarchy.filter_master_list(
            self.nbs.value()["system_type"])
        default_objectives_hierarchy = self.hierarchy.get_default_hierarchy(
            self.nbs.value()["system_type"])
        self.objectives_data.notify(new_hierarchy)
        self.objectives.notify(default_objectives_hierarchy)

    def distribution_update(self):
        objectives_data = self.objectives.value()
        new_objectives_data = copy.deepcopy(objectives_data)
        for (primary_index, secondaries) in enumerate(objectives_data["primaries"]["secondaries"]):
            for (secondary_index, attributes) in enumerate(secondaries["attributes"]):
                for (attribute_index, datasets) in enumerate(attributes["datasets"]):
                    continuousCondition = datasets["type"] == "Continuous"
                    booleanCondition = datasets["type"] == "Boolean" and bool(
                        datasets["isCalculated"])
                    if continuousCondition or booleanCondition:
                        string_function = datasets["properties"]["valueScalingFunction"]
                        if continuousCondition:
                            x, y = GraphMaker.compute_scaling_graph(
                                string_function,
                                datasets["min_value"],
                                datasets["max_value"],
                            )
                        elif booleanCondition:
                            # ici, ajuster num= granularity pour l'affichage
                            x, y = GraphMaker.compute_scaling_graph(
                                string_function,
                                0,
                                int(datasets["calculationDistance"]),
                                num=10,
                            )

                        new_objectives_data["primaries"]["secondaries"][primary_index]["attributes"][secondary_index][
                            "datasets"
                        ][attribute_index]["properties"]["distribution"] = [int(x_) for x_ in list(x)]
                        new_objectives_data["primaries"]["secondaries"][primary_index]["attributes"][secondary_index][
                            "datasets"
                        ][attribute_index]["properties"]["distribution_value"] = [int(y_) for y_ in list(y)]

                        self.subjects_manager.update(
                            "objectives", new_objectives_data)

    def get_informations_at_position(self, cursor: LatLng) -> MapCursorInformations:
        base = MapCursorInformations()
        if calculator := self.suitability_calculator:
            base.objectives = calculator.get_informations_at(
                cursor.lat, cursor.long)
        return base

    def update(self, subject, data):
        self.subjects_manager.update(subject, data)
        if subject == "objectives":
            self.distribution_update()
        if subject == "nbs_system":
            self.objectives_data_update()

    def receive_study_area(self, shp_name):
        study_area_path = self.files_manager.get_shp_path(shp_name)
        lat_long = get_center_latitude_longitude(study_area_path)
        self.study_area.notify(shp_name)
        self.suggested_map_center.notify(LatLng(lat_long[0], lat_long[1]))

    def export_project_save(self):
        return Analysis.__export(f"{self.__get_project_name()}.sproj", self.__repr__())

    def import_project_save(self, file):
        data = Analysis.__import(file)

        analysis_data = data["analysis"]
        self.parameters.notify(analysis_data["parameters"])
        self.nbs.notify(analysis_data["nbs"])
        self.objectives.notify(analysis_data["objectives"])
        self.value_scaling.notify(analysis_data["value_scaling"])
        self.layers.notify(analysis_data["layers"])

        files_data = data["files"]
        for name, data in files_data.items():
            self.files_manager.add_shapefile_from_save(name, data)

        self.receive_study_area(analysis_data["study_area"])

    def compute_suitability(self):
        if self.study_area.value():
            data = self.objectives.value()
            cell_size = self.parameters.value().get("cell_size")
            scaling_function = "x"  # self.parameters.value().get("scaling_function")

            self.suitability_calculator = SuitabilityCalculator(
                self.files_manager.get_writer_path())
            self.suitability_calculator.set_cell_size(cell_size)
            self.suitability_calculator.set_crs("epsg:3857")
            self.suitability_calculator.set_study_area_input(
                self.study_area.value())

            for (primary, weight_primary, secondaries) in zip(
                data["primaries"]["primary"],
                data["primaries"]["weights"],
                data["primaries"]["secondaries"],
            ):
                self.suitability_calculator.add_objective(
                    primary, float(weight_primary))
                for (secondary_index, (secondary, weight_secondary, attributes)) in enumerate(
                    zip(
                        secondaries["secondary"],
                        secondaries["weights"],
                        secondaries["attributes"],
                    )
                ):
                    self.suitability_calculator.objectives[primary].add_subobjective(
                        secondary, secondary_index, float(weight_secondary))
                    for (attribute_index, (attribute, weight_attribute, dataset)) in enumerate(
                        zip(
                            attributes["attribute"],
                            attributes["weights"],
                            attributes["datasets"]
                        )
                    ):
                        file_name = dataset["name"]
                        column_type = dataset["type"]
                        column_name = dataset["column"]
                        is_calculated = bool(
                            dataset["isCalculated"])
                        scaling_function = dataset["properties"]["valueScalingFunction"]
                        missing_data_default_value = dataset["properties"]["missingDataSuitability"]
                        input_file = file_name
                        print("WEIGHT", weight_attribute)
                        if not is_calculated and column_type == "Boolean":
                            self.suitability_calculator.add_file_to_objective(
                                attribute,
                                primary,
                                secondary,
                                attribute_index,
                                input_file,
                                int(weight_attribute),
                                scaling_function,
                                missing_data_default_value,
                            )
                        elif is_calculated and column_type == "Boolean":
                            self.suitability_calculator.add_file_to_calculated_objective(
                                attribute,
                                primary,
                                secondary,
                                attribute_index,
                                input_file,
                                float(weight_attribute),
                                scaling_function,
                                missing_data_default_value,
                                max_distance=dataset["calculationDistance"],
                                granularity=int(dataset["granularity"]),
                                centroid=bool(dataset["centroid"])
                            )
                        elif column_type == "Categorical":
                            categories = dataset["properties"]["distribution"]
                            categories_value = dataset["properties"]["distribution_value"]

                            self.suitability_calculator.add_file_to_categorical_objective(
                                attribute,
                                primary,
                                secondary,
                                attribute_index,
                                input_file,
                                float(weight_attribute),
                                scaling_function,
                                missing_data_default_value,
                                categories,
                                categories_value,
                                column_name,
                            )

                        else:

                            self.suitability_calculator.add_file_to_objective(
                                attribute,
                                primary,
                                secondary,
                                attribute_index,
                                input_file,
                                float(weight_attribute),
                                scaling_function,
                                missing_data_default_value,
                                column_name,
                            )

                    # self.suitability_calculator.objectives[primary].add_file(
                    #    index, path, "output.tiff", int(weight_secondary), scaling_function)

            output_matrix = self.suitability_calculator.process_data()
            path = self.suitability_calculator.matrix_to_raster(output_matrix)
            analysis_df = self.suitability_calculator.tiff_to_geojson(path)

            sub_objectives_json = self.suitability_calculator.process_sub_objectives()

            self.compute_suitability_above_threshold()
            self.compute_suitability_categories()

            return_value = {"file_name": "current analysis",
                            "area": analysis_df.to_json()}
            # return {"file_name": "current analysis", "area": geo_json}
        else:
            return_value = {"file_name": "current analysis", "area": {}}
        print("end of analysis")
        self.sub_analysis.notify(sub_objectives_json)
        self.analysis.notify(return_value)
