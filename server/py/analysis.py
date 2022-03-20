from attr import attributes
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
        self.study_area_path = "temp/terre_shp.shp"
        default_dataset = "temp/Espace_Vert.shp"

        if (subject == "objectives" and len(self.study_area_path) > 0):
            analyser = Analyser()
            analyser.add_study_area(self.study_area_path, "output.tiff")
            for (primary, weight_primary, secondaries) in zip(data["primaries"]["primary"], data["primaries"]["weights"], data["primaries"]["secondaries"]):
                analyser.add_objective(primary, weight_primary)
                for (index, (secondary, weight_secondary, attributes)) in enumerate(zip(secondaries["secondary"], secondaries["weights"], secondaries["attributes"])):
                    #print(index, secondary, weight_secondary)
                    print("UPDATE", attributes["datasets"][0]["id"])
                    path = "temp/" + attributes["datasets"][0]["id"] + ".shp"
                    print("PATH", path)
                    analyser.objectives[primary].add_file(
                        index, path, "output.tiff", weight_secondary)
            analyser.process_data()

    def receive_study_area(self, *files):
        created = self.files_manager.add_files(*files)
        shps = [file for file in created if file.extension == "shp"]
        shxs = [file for file in created if file.extension == "shx"]
        dbfs = [file for file in created if file.extension == "dbf"]

        print("shps", shps, "shxs", shxs)
        if len(shps) == 0:
            raise CallException("No shapefiles received [shp].")
        if len(shxs) == 0:
            raise CallException("No shapefiles received [shx].")
        if len(dbfs) == 0:
            raise CallException("No shapefiles received [dbf].")

        # find a matching pair
        shp = shx = None

        def is_matching_pair():
            return shp != None and shx != None and shp.stem == shx.stem

        # Lever des erreurs si plusieurs fichier shp
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
        print("receive_study_area", shps[0].path)
        self.study_area_path = shps[0].path[0]

        geojson = FileParser.load(self.files_manager, shx.id, shp.id)
        return {"file_name": shx.name, "area": geojson}
