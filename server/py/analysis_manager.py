from py.file_manager import StudyAreaManager
from py.server_socket import ServerSocket
from py.subjects_manager import SubjectsManager
from server.py.file_manager import GeoDatabaseManager


class AnalysisManager:
    namespace = "analysis"
    defaultValues = {"modeler_name": "", "analysis_name": "",
                     "cell_size": 20, "study_area": {"fileName": ""},
                     "geo_database": {"fileName"}}
 
    def __init__(self, subjects_manager: SubjectsManager, socket: ServerSocket):
        """
        The analysis properties will look like this:
            'namespace'.'property': 'value'
        for example:
            'analysis.modeler_name':  ''
            'analysis.analysis_name': ''
            'analysis.cell_size':     20
            'analysis.study_area':    {'filename': ''}
        """
        self.properties = {
            property: subjects_manager.create(
                f"{self.namespace}.{property}", defaultValue)
            for property, defaultValue in self.defaultValues.items()
        }

        socket.bind_command_m(
            f"{self.namespace}.update_study_area",
            StudyAreaManager(self.properties["study_area"].notify),
            StudyAreaManager.receive_files,
        )
        socket.bind_command_m(
            f"{self.namespace}.update_geo_database",
            GeoDatabaseManager(self.properties["geo_database"].notify),
            GeoDatabaseManager.receive_files,
        )
        socket.bind_command_m(
            f"{self.namespace}.update_properties", self, self.update)

    def update(self, properties: dict):
        # validate all properties match
        disjoint_keys = set(properties).difference(self.properties)
        if len(disjoint_keys) > 0:
            return print("There are properties not belonging to the analysis:", disjoint_keys)

        # update every properties
        for key, value in properties.items():
            if key not in disjoint_keys:
                self.properties[key].notify(value)
