from .serializable import Serializable
from .suitability_calculator import SuitabilityCalculator
from .map import LatLng, MapCursorInformations
from base64 import b64encode, b64decode
import copy
import pickle
import json

from py.graph_maker import GraphMaker


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

        self.objectives = subjects_manager.create(
            "objectives",
            {
                "main": "Needs",
                "primaries": {"primary": [], "weights": [], "secondaries": []}
                # ...
            },
        )

        self.default_missing_data = subjects_manager.create(
            "default_missing_data",
            100,
        )
        self.value_scaling = subjects_manager.create(
            "value_scaling",
            [],
        )

        self.layers = subjects_manager.create("layers", {})

        self.analysis = subjects_manager.create("analysis", {})

        # suitability categories: ([0-10[, [10-20[, [20-30[, [30-40[, [40-50[, [50-60[, [60-70[, [70-80[, [80-90[, [90-100]) or None
        self.suitability_categories = subjects_manager.create(
            "analysis.visualization.suitability_categories", None
        )

        # suitability : [0, 1] or None
        self.suitability_threshold = subjects_manager.create(
            "analysis.visualization.suitability_threshold", 0.5
        )
        self.suitability_above_threshold = subjects_manager.create(
            "analysis.visualization.suitability_above_threshold", None
        )

    def __repr__(self) -> str:
        return json.dumps(self.serialize())

    def compute_suitability_categories(self):
        if (
            self.suitability_calculator is not None
            and (array := self.suitability_calculator.get_array()).any()
        ):
            study_area = self.suitability_calculator.get_study_area()
            self.suitability_categories.notify(
                {
                    "00-10": GraphMaker.compute_fraction_in_range(
                        study_area, array, 0.00, 0.10
                    ),
                    "10-20": GraphMaker.compute_fraction_in_range(
                        study_area, array, 0.10, 0.20
                    ),
                    "20-30": GraphMaker.compute_fraction_in_range(
                        study_area, array, 0.20, 0.30
                    ),
                    "30-40": GraphMaker.compute_fraction_in_range(
                        study_area, array, 0.30, 0.40
                    ),
                    "40-50": GraphMaker.compute_fraction_in_range(
                        study_area, array, 0.40, 0.50
                    ),
                    "50-60": GraphMaker.compute_fraction_in_range(
                        study_area, array, 0.50, 0.60
                    ),
                    "60-70": GraphMaker.compute_fraction_in_range(
                        study_area, array, 0.60, 0.70
                    ),
                    "70-80": GraphMaker.compute_fraction_in_range(
                        study_area, array, 0.70, 0.80
                    ),
                    "80-90": GraphMaker.compute_fraction_in_range(
                        study_area, array, 0.80, 0.90
                    ),
                    "90-100": GraphMaker.compute_fraction_in_range(
                        study_area, array, 0.90, 1.01
                    ),
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
                    min(1, max(0, threshold)),
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
                "layers": self.layers.value()
                # We dont had the analysis, but we could
            },
            "files": self.files_manager.serialize(),
        }

    def __get_project_name(self):
        # by default, the name is "analysis.ssanto", unless a name was specified by the user
        parameters = self.parameters.value()
        return (
            parameters["analysis_name"] if "analysis_name" in parameters else "analysis"
        )

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
        added = self.files_manager.add_files(*files)
        for shapefile in added:
            self.add_layer("normal", shapefile.name)

    def remove_file(self, name):
        self.files_manager.remove_file(name)
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

    def distribution_update(self):
        objectives_data = self.objectives.value()
        new_objectives_data = copy.deepcopy(objectives_data)
        for (primary_index, secondaries) in enumerate(
            objectives_data["primaries"]["secondaries"]
        ):
            for (secondary_index, attributes) in enumerate(secondaries["attributes"]):
                for (attribute_index, datasets) in enumerate(attributes["datasets"]):
                    continuousCondition = datasets["type"] == "Continuous"
                    booleanCondition = datasets["type"] == "Boolean" and bool(
                        datasets["isCalculated"]
                    )
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

                        new_objectives_data["primaries"]["secondaries"][primary_index][
                            "attributes"
                        ][secondary_index]["datasets"][attribute_index]["properties"][
                            "distribution"
                        ] = [
                            int(x_) for x_ in list(x)
                        ]
                        new_objectives_data["primaries"]["secondaries"][primary_index][
                            "attributes"
                        ][secondary_index]["datasets"][attribute_index]["properties"][
                            "distribution_value"
                        ] = [
                            int(y_) for y_ in list(y)
                        ]

                        self.subjects_manager.update("objectives", new_objectives_data)

    def get_informations_at_position(self, cursor: LatLng) -> MapCursorInformations:
        base = MapCursorInformations()
        if calculator := self.suitability_calculator:
            base.objectives = calculator.get_informations_at(cursor.lat, cursor.long)
        return base

    def update(self, subject, data):
        self.subjects_manager.update(subject, data)
        if subject == "objectives":
            self.distribution_update()

    def receive_study_area(self, shp_name):
        print("receive_study_area", shp_name)
        """
        study_area = { 'file_name': '', 'area': None }
        if shp_name != '':
            shapefile = self.files_manager.get_file(shp_name)
            geojson = FileParser.load(
                self.files_manager, shapefile.get_shp(), shapefile.get_shx())
            study_area = {"file_name": shp_name, "area": geojson}
        """
        self.study_area.notify(shp_name)

    def export_project_save(self):
        return Analysis.__export(f"{self.__get_project_name()}.sproj", self.__repr__())

    def import_project_save(self, file):
        data = Analysis.__import(file)

        analysis_data = data["analysis"]
        self.parameters.notify(analysis_data["parameters"])
        self.study_area.notify(analysis_data["study_area"])
        self.nbs.notify(analysis_data["nbs"])
        self.objectives.notify(analysis_data["objectives"])
        self.value_scaling.notify(analysis_data["value_scaling"])
        self.layers.notify(analysis_data["layers"])

        files_data = data["files"]
        for name, data in files_data.items():
            self.files_manager.add_shapefile_from_save(name, data)

    def compute_suitability(self):
        if self.study_area.value():
            data = self.objectives.value()
            cell_size = self.parameters.value().get("cell_size")
            scaling_function = "x"  # self.parameters.value().get("scaling_function")

            self.suitability_calculator = SuitabilityCalculator(
                self.files_manager.get_writer_path()
            )
            self.suitability_calculator.set_cell_size(cell_size)
            self.suitability_calculator.set_crs("epsg:3857")
            self.suitability_calculator.set_study_area_input(self.study_area.value())

            for (primary, weight_primary, secondaries) in zip(
                data["primaries"]["primary"],
                data["primaries"]["weights"],
                data["primaries"]["secondaries"],
            ):
                self.suitability_calculator.add_objective(primary, int(weight_primary))
                for (index, (secondary, weight_secondary, attributes)) in enumerate(
                    zip(
                        secondaries["secondary"],
                        secondaries["weights"],
                        secondaries["attributes"],
                    )
                ):

                    file_name = attributes["datasets"][0]["name"]
                    column_type = attributes["datasets"][0]["type"]
                    column_name = attributes["datasets"][0]["column"]
                    is_calculated = bool(attributes["datasets"][0]["isCalculated"])
                    scaling_function = attributes["datasets"][0]["properties"][
                        "valueScalingFunction"
                    ]
                    missing_data_default_value = 0

                    input_file = file_name
                    if not is_calculated and column_type == "Boolean":
                        self.suitability_calculator.add_file_to_objective(
                            secondary,
                            primary,
                            index,
                            input_file,
                            int(weight_secondary),
                            scaling_function,
                            missing_data_default_value,
                        )
                    elif is_calculated and column_type == "Boolean":
                        self.suitability_calculator.add_file_to_calculated_objective(
                            secondary,
                            primary,
                            index,
                            input_file,
                            int(weight_secondary),
                            scaling_function,
                            missing_data_default_value,
                            attributes["datasets"][0]["calculationDistance"],
                        )
                    elif column_type == "Categorical":
                        categories = attributes["datasets"][0]["properties"][
                            "distribution"
                        ]
                        categories_value = attributes["datasets"][0]["properties"][
                            "distribution_value"
                        ]

                        self.suitability_calculator.add_file_to_categorical_objective(
                            secondary,
                            primary,
                            index,
                            input_file,
                            int(weight_secondary),
                            scaling_function,
                            missing_data_default_value,
                            categories,
                            categories_value,
                            column_name,
                        )

                    else:

                        self.suitability_calculator.add_file_to_objective(
                            secondary,
                            primary,
                            index,
                            input_file,
                            int(weight_secondary),
                            scaling_function,
                            missing_data_default_value,
                            column_name,
                        )

                    # self.suitability_calculator.objectives[primary].add_file(
                    #    index, path, "output.tiff", int(weight_secondary), scaling_function)

            geo_json = self.suitability_calculator.process_data()

            self.compute_suitability_above_threshold()
            self.compute_suitability_categories()

            return_value = {"file_name": "current analysis", "area": geo_json}
            # return {"file_name": "current analysis", "area": geo_json}
        else:
            return_value = {"file_name": "current analysis", "area": {}}
        print("end of analysis")
        self.analysis.notify(return_value)
