
from server.py.file_manager import FileParser
from .server_socket import CallException

from os.path import splitext

class Analysis:
    def __init__(self, subjects_manager, files_manager):
        self.subjects_manager = subjects_manager
        self.files_manager = files_manager

        self.parameters = subjects_manager.create('parameters', {
            'analysis_name': '',
            'modeler_name': '',
            'cell_size': 20,
        })
        
        self.nbs = subjects_manager.create('nbs_system', {
            'system_type': '2', 
            # ...
        })

        self.study_area = subjects_manager.create('study_area', {
            'file_name': '',
            'area': {},
        })

    def perform_analysis(self):
        # self.parameters.value().get('analysis_name')
        # ...
        # some change to the data
        # ...
        # self.parameters.update()
        pass

    def receive_study_area(self, files):
        for file in files:
            self.files_manager.add_file(file["fileName"], file["base64content"])

        shapefiles = [
            name+ext
            for name, ext in [splitext(file["fileName"]) for file in files]
            if ext == ".shp"
        ]

        if len(shapefiles) == 0:
            raise CallException("No shapefiles received.")

        # We only read the first one
        shapefile = shapefiles[0]
        geojson = FileParser.load(shapefile)
        return {"file_name": shapefile, "area": geojson}