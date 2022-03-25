from .serializable import Serializable
from .file import File
from .file_manager import FileParser
from .server_socket import CallException
from base64 import b64encode
import pickle


class StudyArea(Serializable):
    def __init__(self, name, area):
        self.name = name
        self.area = area

    def serialize(self) -> dict:
        return {"file_name": self.name, "area": self.area}


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

        self.parameters = subjects_manager.create(
            "parameters",
            {
                "analysis_name": "Dummy analysis",
                "modeler_name": "chris",
                "cell_size": 18,
            },
        )

        self.study_area = subjects_manager.create("analysis.study_area", None)

        self.nbs = subjects_manager.create(
            "nbs_system",
            {
                "system_type": "2",
                # ...
            },
        )

    def __repr__(self) -> str:
        return str(self.serialize())

    def serialize(self) -> dict:
        study_area = self.study_area.value()
        return {
            "analysis": {
                "parameters": self.parameters.value(),
                "study_area": study_area.serialize() if study_area else None,
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

    def receive_study_area(self, *files):
        created = self.files_manager.add_files(*files)
        shps = [file for file in created if file.extension == "shp"]
        shxs = [file for file in created if file.extension == "shx"]

        if len(shps) == 0:
            raise CallException("No shapefiles received [shp].")
        if len(shxs) == 0:
            raise CallException("No shapefiles received [shx].")

        # find a matching pair
        def is_matching_pair(shp: File, shx: File):
            return shp != None and shx != None and shp.stem == shx.stem

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

        geojson = FileParser.load(self.files_manager, shx.id, shp.id)
        self.study_area.notify(StudyArea(shp.name, geojson))
        return self.study_area.value().serialize()

    def export_project_save(self):
        return Analysis.__export(f"{self.__get_project_name()}.sproj", self.__repr__())

    def export_weights(self):
        # TODO: get weights
        return Analysis.__export(f"{self.__get_project_name()}.swghts", {"weights": "todo"})

    def export_objective_hierarchy(self):
        # TODO: get objective hierarchy
        return Analysis.__export(f"{self.__get_project_name()}.soh", {"objective_hierarchy": "todo"})
