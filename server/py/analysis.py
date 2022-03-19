from .analyser import Analyser
from .file_manager import FileParser
from .server_socket import CallException

from os.path import splitext


class Analysis:
    def __init__(self, subjects_manager, files_manager, analyser):
        self.subjects_manager = subjects_manager
        self.files_manager = files_manager
        self.analyser = analyser
        self.study_area_path = ""

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

        self.objectives = subjects_manager.create(
            "objectives",
            {
                "objectives": {
                    "main": "Needs",
                    "primaries": {
                        "primary": [],
                        "weights": [],
                        "secondaries": []
                    }











                },
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

    def update(self, subject, data):
        self.subjects_manager.update(subject, data)
        if (subject == "objectives" and len(self.study_area_path) > 0):
            analyser = Analyser()
            print(subject, type(data))

            print("update", self.study_area_path)
            analyser.add_study_area(self.study_area_path, "output.tiff")

            # self.analyser.add_objective()

    def receive_study_area(self, *files):
        temp_dir = "temp/"
        created = self.files_manager.add_files(temp_dir, *files)
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
        self.study_area_path = "../" + shps[0].path[0]

        geojson = FileParser.load(self.files_manager, shx.id, shp.id)
        return {"file_name": shx.name, "area": geojson}
