from .serializable import Serializable
from .suitability_calculator import SuitabilityCalculator
from .file import File
from .file_manager import FileParser
from .map import LatLng, MapCursorInformations
from .server_socket import CallException
from base64 import b64encode
import pickle


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

        self.value_scaling = subjects_manager.create(
            "value_scaling",
            [],
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

    def existingAttribute(self, primary, secondary, attribute, dataset):
        value_scaling_data = self.value_scaling.value()
        for existing_attribute in value_scaling_data:
            if (
                attribute == existing_attribute["attribute"]
                and existing_attribute["primary"] == primary
                and existing_attribute["secondary"] == secondary
                and existing_attribute["dataset"]["id"] == dataset["id"]
            ):
                return existing_attribute
        return None

    def value_scaling_update(self):
        newValueScaling = []
        objectives_data = self.objectives.value()
        print("objectives_data", objectives_data)
        for (primary, secondaries) in zip(
            objectives_data["primaries"]["primary"], objectives_data["primaries"]["secondaries"]
        ):
            for (index, (secondary, attributes)) in enumerate(zip(secondaries["secondary"], secondaries["attributes"])):
                for (attribute, dataset) in zip(attributes["attribute"], attributes["datasets"]):
                    # type continuous or categorical according to dataset
                    # à partir du dataset et colonne, aller chercher
                    # max min, catégories,
                    newAttribute = self.existingAttribute(primary, secondary, attribute, dataset)
                    if newAttribute == None:
                        newAttribute = {
                            "attribute": attribute,
                            "dataset": dataset["id"],
                            "type": dataset["columnType"],
                            "column": dataset["column"],
                            "properties": {
                                "min": 0,
                                "max": 100,
                                "vs_function": "x",
                                "distribution": [20, 40, 60, 80, 100],
                                "distribution_value": [20, 40, 30, 80, 100],
                            },
                            "primary": primary,
                            "secondary": secondary,
                        }
                    newValueScaling.append(newAttribute)
        self.subjects_manager.update("value_scaling", newValueScaling)

    # TODO: replace with the map informations at the cursor's position

    def get_informations_at_position(self, cursor: LatLng) -> MapCursorInformations:
        base = MapCursorInformations()
        if calculator := self.suitability_calculator:
            data = calculator.get_cell_data(cursor.lat, cursor.long)
            print("cursor data", data)
        if cursor is not None:
            base.placeholder += f". lat: {cursor.lat:.3f}, lng: {cursor.long:.3f}"
        return base

    def update(self, subject, data):
        self.subjects_manager.update(subject, data)
        if subject == "objectives":
            self.value_scaling_update()

    def receive_study_area(self, *files):
        created = self.files_manager.add_files(*files)
        shps = [file for file in created if file.extension == "shp"]
        shxs = [file for file in created if file.extension == "shx"]
        dbfs = [file for file in created if file.extension == "dbf"]

        # print("shps", shps, "shxs", shxs)
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

            self.suitability_calculator = SuitabilityCalculator(self.files_manager.get_writer_path())
            self.suitability_calculator.set_cell_size(cell_size)
            self.suitability_calculator.set_crs("epsg:32188")
            self.suitability_calculator.set_study_area_input(self.study_area_file_name)

            for (primary, weight_primary, secondaries) in zip(
                data["primaries"]["primary"], data["primaries"]["weights"], data["primaries"]["secondaries"]
            ):
                self.suitability_calculator.add_objective(primary, int(weight_primary))
                for (index, (secondary, weight_secondary, attributes)) in enumerate(
                    zip(secondaries["secondary"], secondaries["weights"], secondaries["attributes"])
                ):
                    file_id = attributes["datasets"][0]["id"]
                    file = self.files_manager.get_files_by_id(file_id)
                    # "temp/" + file[0].group_id + ".shp"
                    print("FILE")
                    input_file = file[0].name
                    self.suitability_calculator.add_file_to_objective(
                        primary, index, input_file, int(weight_secondary), scaling_function
                    )
                    # self.suitability_calculator.objectives[primary].add_file(
                    #    index, path, "output.tiff", int(weight_secondary), scaling_function)

            geo_json = self.suitability_calculator.process_data()

            return {"file_name": "current analysis", "area": geo_json}
        else:
            return {"file_name": "current analysis", "area": {}}
