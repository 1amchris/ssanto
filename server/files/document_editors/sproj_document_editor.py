from io import UnsupportedOperation
from files.document_editors.json_document_editor import JSONDocumentEditor
from datetime import datetime
import geopandas
import json


class StudyAreaHelper:
    @staticmethod
    def get_registry():
        return [
            (lambda file: file is None, lambda *_: None),
            (lambda file: file.endswith(".shp"), StudyAreaHelper.shapefile_to_geojson),
            (lambda file: file.endswith(".geojson"), StudyAreaHelper.geojsonfile_to_geojson),
        ]

    @staticmethod
    def shapefile_to_geojson(file):
        return json.loads(geopandas.read_file(file).to_json())

    @staticmethod
    def geojsonfile_to_geojson(file):
        return json.loads(geopandas.read_file(file).to_json())

    @staticmethod
    def convert_to_geojson(file):
        for index, registry in enumerate(StudyAreaHelper.get_registry()):
            try:
                if registry[0](file):
                    return registry[1](file)
            except:
                print(f"Error occured while converting file to geojson. Check registered converter #{index}.")

        raise UnsupportedOperation("Unsupported file type")

    @staticmethod
    def get_center_from_geojson(geojson):
        gdf = geopandas.GeoDataFrame.from_features(geojson)
        return {"lat": gdf.centroid.x.mean(), "long": gdf.centroid.y.mean()}


class SSantoDocumentEditor(JSONDocumentEditor):
    default_view = "ssanto-map"

    def __get_value(self, key):
        segments = key.split(".")
        scope = self.content
        for segment in segments[:-1]:
            if segment not in scope:
                return None
            scope = scope[segment]
        return scope[segments[-1]]

    def _update(self, changes: dict):

        changes["analysis.modifiedOn"] = str(datetime.date(datetime.now()))

        study_area_key = "analysis.studyArea"
        if study_area_key in changes and changes[study_area_key] != self.__get_value(study_area_key):
            study_area_uri = changes[study_area_key]
            study_area_root = "map.studyArea"
            if study_area_uri is not None:
                geojson = StudyAreaHelper.convert_to_geojson(study_area_uri[len("file://") :])
                changes[f"{study_area_root}.geojson"] = geojson
                changes[f"{study_area_root}.name"] = "Study Area"
                changes[f"{study_area_root}.checked"] = True
                changes[f"{study_area_root}.center"] = StudyAreaHelper.get_center_from_geojson(geojson)
            else:
                changes[study_area_key] = None

        for segments in filter(None, map(lambda key: key.split("."), changes.keys())):
            scope = self.content
            for segment in segments[:-1]:
                if segment not in scope:
                    scope[segment] = {}
                scope = scope[segment]
            scope[segments[-1]] = changes[".".join(segments)]

        return segments is not None
