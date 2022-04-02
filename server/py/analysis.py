from .serializable import Serializable
from .suitability_calculator import SuitabilityCalculator
from .file import File
from .file_manager import FileParser
from .map import LatLng, MapCursorInformations
from .server_socket import CallException
from base64 import b64encode, b64decode
import pickle
import json

class Analysis(Serializable):
    @staticmethod
    def __export(filename, content):
        return {
            "name": filename,
            "content": b64encode(pickle.dumps(content)).decode("utf-8"),
        }

    @staticmethod
    def __import(content):
        return json.loads(pickle.loads(b64decode(content.encode('utf-8'))))

    def __init__(self, subjects_manager, files_manager):
        self.subjects_manager = subjects_manager
        self.files_manager = files_manager

        self.parameters = subjects_manager.create(
            "parameters",
            {
                "analysis_name": "",
                "modeler_name": "",
                "cell_size": 20,
            },
        )

        self.study_area = subjects_manager.create(
            "study_area", ''
        )

        self.nbs = subjects_manager.create(
            "nbs_system",
            {
                "system_type": "0",
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

        self.layers = subjects_manager.create(
            "layers",
            {}
        )

        self.analysis = subjects_manager.create(
            "analysis",
            {}
        )

    def __repr__(self) -> str:
        return json.dumps(self.serialize())

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
        return parameters["analysis_name"] if "analysis_name" in parameters else "analysis"

    '''
    There is an exemple of method to be implemented as a bind command
    and how to use subjects
    def perform_analysis(self):
        # self.parameters.value().get('analysis_name')
        # ...
        # some change to the data
        # ...
        # self.parameters.update()
        pass
    '''
    def add_files(self, *files):
        added = self.files_manager.add_files(*files)
        for shapefile in added:
            self.add_layer('normal', shapefile.name)

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

    # TODO: replace with the map informations at the cursor's position
    def get_informations_at_position(self, cursor: LatLng) -> MapCursorInformations:
        base = MapCursorInformations()
        if cursor is not None:
            base.placeholder += f". lat: {cursor.lat:.3f}, lng: {cursor.long:.3f}"  
        return base

    def update(self, subject, data):
        self.subjects_manager.update(subject, data)

    def receive_study_area(self, shp_name):
        print("receive_study_area", shp_name)
        '''
        study_area = { 'file_name': '', 'area': None }
        if shp_name != '':        
            shapefile = self.files_manager.get_file(shp_name)
            geojson = FileParser.load(self.files_manager, shapefile.get_shp(), shapefile.get_shx())
            study_area = {"file_name": shp_name, "area": geojson}
        '''
        self.study_area.notify(shp_name)

    def export_project_save(self):
        return Analysis.__export(f"{self.__get_project_name()}.sproj", self.__repr__())

    def import_project_save(self, file):
        data = Analysis.__import(file)

        analysis_data = data['analysis']
        self.parameters.notify(analysis_data['parameters'])
        self.study_area.notify(analysis_data['study_area'])
        self.nbs.notify(analysis_data['nbs'])
        self.objectives.notify(analysis_data['objectives'])
        self.value_scaling.notify(analysis_data['value_scaling'])
        self.layers.notify(analysis_data['layers'])

        files_data = data['files']
        for name, data in files_data.items():
            self.files_manager.add_shapefile_from_save(name, data)

    def compute_suitability(self):
        if self.study_area.value():
            data = self.objectives.value()
            cell_size = self.parameters.value().get("cell_size")
            scaling_function = "x"  # self.parameters.value().get("scaling_function")

            calculator = SuitabilityCalculator(self.files_manager.get_writer_path())
            calculator.set_cell_size(cell_size)
            calculator.set_crs("epsg:32188")
            calculator.set_study_area_input(self.study_area.value())

            for (primary, weight_primary, secondaries) in zip(
                data["primaries"]["primary"], data["primaries"]["weights"], data["primaries"]["secondaries"]
            ):
                calculator.add_objective(primary, int(weight_primary))
                for (index, (secondary, weight_secondary, attributes)) in enumerate(
                    zip(secondaries["secondary"], secondaries["weights"], secondaries["attributes"])
                ):
                    input_file = attributes["datasets"][0]["name"]
                    calculator.add_file_to_objective(
                        primary, index, input_file, int(weight_secondary), scaling_function
                    )
                    # calculator.objectives[primary].add_file(
                    #    index, path, "output.tiff", int(weight_secondary), scaling_function)

            geo_json = calculator.process_data()

            return_value = {"file_name": "current analysis", "area": geo_json}
            #return {"file_name": "current analysis", "area": geo_json}
        else:
            return_value = {"file_name": "current analysis", "area": {}}
        
        self.analysis.notify(return_value)
