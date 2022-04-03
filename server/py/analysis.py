from .serializable import Serializable
from .suitability_calculator import SuitabilityCalculator
from .file import File
from .file_manager import FileParser
from .map import LatLng, MapCursorInformations
from .server_socket import CallException
from base64 import b64encode
import copy
import pickle

from py.graph_maker import Graph_maker


class Analysis(Serializable):
    @staticmethod
    def __export(filename, content):
        return {
            "name": filename,
            "content": b64encode(pickle.dumps(content)).decode("utf-8"),
        }

    def __init__(self, subjects_manager, files_manager):
        self.subjects_manager = subjects_manager
        self.files_manager = files_manager
        self.suitability_calculator = None
        self.study_area_file_name = None

        self.parameters = subjects_manager.create(
            "parameters",
            {
                "analysis_name": "",
                "modeler_name": "",
                "cell_size": 20,
            },
        )

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

    def __repr__(self) -> str:
        return str(self.serialize())

    def serialize(self) -> dict:
        return {
            "analysis": {
                "parameters": self.parameters.value(),
                # Commented for now, I'll (Tristan) fix it later.
                # "study_area": self.study_area.__dict__() if self.study_area else None,
                "nbs": self.nbs.value(),
            },
            "files": self.files_manager.serialize(),
        }

    def __get_project_name(self):
        # by default, the name is "analysis.ssanto", unless a name was specified by the user
        parameters = self.parameters.value()
        return parameters["analysis_name"] if "analysis_name" in parameters else "analysis"

    def perform_analysis(self):
        # self.parameters.value().get('analysis_name')
        # ...
        # some change to the data
        # ...
        # self.parameters.update()
        pass

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
                            x, y = Graph_maker.compute_scaling_graph(
                                string_function, datasets["min_value"], datasets["max_value"]
                            )
                        elif booleanCondition:
                            x, y = Graph_maker.compute_scaling_graph(
                                string_function, 0, int(datasets["calculationDistance"]), num=10
                            )

                        new_objectives_data["primaries"]["secondaries"][primary_index]["attributes"][secondary_index][
                            "datasets"
                        ][attribute_index]["properties"]["distribution"] = [int(x_) for x_ in list(x)]
                        new_objectives_data["primaries"]["secondaries"][primary_index]["attributes"][secondary_index][
                            "datasets"
                        ][attribute_index]["properties"]["distribution_value"] = [int(y_) for y_ in list(y)]

        self.subjects_manager.update("objectives", new_objectives_data)

    # TODO: replace with the map informations at the cursor's position

    def get_informations_at_position(self, cursor: LatLng) -> MapCursorInformations:
        base = MapCursorInformations()
        if calculator := self.suitability_calculator:
            base.objectives = calculator.get(cursor.lat, cursor.long)
            print("cursor data", base.objectives)
        return base

    def update(self, subject, data):
        self.subjects_manager.update(subject, data)
        if subject == "objectives":
            self.distribution_update()

    def receive_study_area(self, *files):
        created = self.files_manager.add_files(*files)
        shps = [file for file in created if file.extension == "shp"]
        shxs = [file for file in created if file.extension == "shx"]
        dbfs = [file for file in created if file.extension == "dbf"]

        if len(shps) == 0:
            raise CallException("No shapefiles received [shp].")
        if len(shxs) == 0:
            raise CallException("No shapefiles received [shx].")
        if len(dbfs) == 0:
            raise CallException("No shapefiles received [dbf].")

        # find a matching pair
        def is_matching_pair(shp: File, shx: File):
            return shp != None and shx != None and shp.stem == shx.stem

        # Lever des erreurs si plusieurs fichier shp
        for shp in shps:
            for shx in shxs:
                if is_matching_pair(shp, shx):
                    break
            if is_matching_pair(shp, shx):
                break
        else:
            raise CallException(
                "No valid shapefiles uploaded. Make sure that both [.shx and .shp are uploaded, and both have the same name, then try again.]"
            )
        print("receive_study_area", shps[0].name)
        self.study_area_file_name = shps[0].name  # shp.name?

        geojson = FileParser.load(self.files_manager, shx.id, shp.id)
        return {"file_name": shp.name, "area": geojson}

    def export_project_save(self):
        return Analysis.__export(f"{self.__get_project_name()}.sproj", self.__repr__())

    def compute_suitability(self):
        if self.study_area_file_name:
            data = self.objectives.value()
            cell_size = self.parameters.value().get("cell_size")
            scaling_function = "x"  # self.parameters.value().get("scaling_function")

            self.suitability_calculator = SuitabilityCalculator(
                self.files_manager.get_writer_path())
            self.suitability_calculator.set_cell_size(cell_size)
            self.suitability_calculator.set_crs("epsg:32188")
            self.suitability_calculator.set_study_area_input(
                self.study_area_file_name, self.files_manager)

            for (primary, weight_primary, secondaries) in zip(
                data["primaries"]["primary"], data["primaries"]["weights"], data["primaries"]["secondaries"]
            ):
                self.suitability_calculator.add_objective(
                    primary, int(weight_primary))
                for (index, (secondary, weight_secondary, attributes)) in enumerate(
                    zip(secondaries["secondary"],
                        secondaries["weights"], secondaries["attributes"])
                ):

                    file_id = attributes["datasets"][0]["id"]
                    column_type = attributes["datasets"][0]["type"]
                    column_name = attributes["datasets"][0]["column"]
                    is_calculated = bool(
                        attributes["datasets"][0]["isCalculated"])
                    scaling_function = attributes["datasets"][0]["properties"]["valueScalingFunction"]
                    file = self.files_manager.get_files_by_id(file_id)
                    # "temp/" + file[0].group_id + ".shp"
                    if(len(file) > 0):
                        input_file = file[0].name
                        if not is_calculated and column_type == "Boolean":
                            self.suitability_calculator.add_file_to_objective(
                                primary, index, input_file, int(
                                    weight_secondary), scaling_function
                            )
                        elif is_calculated and column_type == 'Boolean':
                            self.suitability_calculator.add_file_to_calculated_objective(
                                primary,
                                index,
                                input_file,
                                int(weight_secondary),
                                scaling_function,
                                attributes["datasets"][0]["calculationDistance"],
                            )
                        elif column_type == "Categorical":
                            categories = attributes["datasets"][0]["properties"]["distribution"]
                            categories_value = attributes["datasets"][0]["properties"]["distribution_value"]

                            self.suitability_calculator.add_file_to_categorical_objective(
                                primary,
                                index,
                                input_file,
                                int(weight_secondary),
                                scaling_function,
                                categories,
                                categories_value,
                                column_name,
                            )

                        else:

                            self.suitability_calculator.add_file_to_objective(
                                primary, index, input_file, int(
                                    weight_secondary), scaling_function, column_name
                            )

                    # self.suitability_calculator.objectives[primary].add_file(
                    #    index, path, "output.tiff", int(weight_secondary), scaling_function)
                    else:
                        print("ob, no dataset for an objectives")
            geo_json = self.suitability_calculator.process_data()

            return {"file_name": "current analysis", "area": geo_json}
        else:
            return {"file_name": "current analysis", "area": {}}
