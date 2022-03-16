from .file_manager import FileParser
from .server_socket import CallException
from datetime import datetime
import pickle
import b64encode from base64


class Analysis:
    def __init__(self, subjects_manager, files_manager):
        self.subjects_manager = subjects_manager
        self.files_manager = files_manager

        self.parameters = subjects_manager.create(
            "parameters",
            {
                "analysis_name": "allo",
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
        shp = shx = None

        def is_matching_pair():
            return shp != None and shx != None and shp.stem == shx.stem

        for shp in shps:
            for shx in shxs:
                if is_matching_pair():
                    break
            if is_matching_pair():
                break
        else:
            raise CallException(
                "No valid shapefiles uploaded. Make sure that both [.shx and .shp are uploaded, and both have the same name, then try again.]"
            )

        geojson = FileParser.load(self.files_manager, shx.id, shp.id)
        return {"file_name": shx.name, "area": geojson}

    def create_save_file(self):
        # Edit here to add data to save
        save = {"parameters": self.parameters, "nbs": self.nbs, "file_manager": self.files_manager, "subjects_manager": self.subjects_manager}

        saved_content = pickle.dumps(save)
        timestamp = str(datetime.now()).replace(" ","_").replace(":","-")
        filename = f"analysis_{timestamp}.ssanto"
        return {"filename": filename, "content": b64encode(saved_content)}