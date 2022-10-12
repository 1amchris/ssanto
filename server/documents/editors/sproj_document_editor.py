from functools import reduce
from io import UnsupportedOperation
from typing import Union
from datetime import datetime

import geopandas
import json
import rasterio
import numpy as np
from analysis.analysis import Analysis

from documents.editors.json_document_editor import JSONDocumentEditor
from documents.utils import uri_to_path
from logger.manager import LogsManager
from tasks.manager import TasksManager


class StudyAreaHelper:
    # TODO: There are multiple functions in this class that should be moved to a geojson helper class instead

    @staticmethod
    def get_registry():
        return [
            (lambda file: file is None, lambda *_: None),
            (lambda file: file.lower().endswith(".shp"), StudyAreaHelper.shapefile_to_geojson),
            (lambda file: file.lower().endswith(".geojson"), StudyAreaHelper.geojsonfile_to_geojson),
            # (
            #     lambda file: file.lower().endswith(".tif") or file.lower().endswith(".tiff"),
            #     StudyAreaHelper.rasterfile_to_geojson,
            # ),
        ]

    @staticmethod
    def shapefile_to_geojson(file):
        return json.loads(geopandas.read_file(file).to_crs("epsg:4326").to_json())

    @staticmethod
    def rasterfile_to_geojson(file):
        # TODO: Takes roughly forever to work, and eats memory until it crashes.
        with rasterio.open(file) as f:
            data = f.meta
            image = f.read()  # first band
            image = np.int16(image)
            geoms = list(
                {"properties": {"suitability": suitability}, "geometry": geometry}
                for geometry, suitability in rasterio.features.shapes(image, mask=None, transform=data["transform"])
            )
            gdf = geopandas.GeoDataFrame.from_features(geoms, crs=data["crs"])
            return json.loads(gdf.to_crs("epsg:4326").to_json())

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

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.supported_create_types = {
            "primary": self.__handle_primary_creation,
            "secondary": self.__handle_secondary_creation,
            "attribute": self.__handle_attribute_creation,
        }
        self.supported_delete_types = {
            "primary": self.__handle_primary_deletion,
            "secondary": self.__handle_secondary_deletion,
            "attribute": self.__handle_attribute_deletion,
        }
        self.supported_run_types = {
            "analysis": self.__handle_run_analysis,
        }
        self.pre_update_hooks = [
            self.__handle_any_change,
            self.__handle_create_directive,
            self.__handle_delete_directive,
            self.__handle_run_directive,
            self.__handle_study_area_change,
            self.__handle_map_click,
        ]

    def __handle_primary_creation(self, changes: dict, main: str, options: dict = {}, **kwargs):
        primaries: list = self.get_content()["objectives"][main]["primaries"]
        index = 0 if primaries is None else len(primaries)

        prototype = {
            "name": options["name"] if "name" in options else f"Primary Objective ({index + 1})",
            "weight": options["weight"] if "weight" in options else 1,
            "aggregation": options["aggregation"] if "aggregation" in options else {"function": "sum"},
            "secondaries": options["secondaries"] if "secondaries" in options else [],
        }

        changes[f"objectives.{main}.primaries.{index}"] = prototype
        return changes

    def __handle_primary_deletion(self, changes: dict, main: str, primary: Union[str, int], **kwargs):
        primary = int(primary)
        primaries: list = self.get_content()["objectives"][main]["primaries"]
        primaries.remove(primaries[primary])

        return changes

    def __handle_secondary_creation(
        self,
        changes: dict,
        main: str,
        primary: Union[int, str],
        options: dict = {},
        **kwargs,
    ):
        primary = int(primary)
        secondaries: list = self.get_content()["objectives"][main]["primaries"][primary]["secondaries"]
        index = 0 if secondaries is None else len(secondaries)

        prototype = {
            "name": options["name"] if "name" in options else f"Secondary Objective ({index + 1})",
            "weight": options["weight"] if "weight" in options else 1,
            "aggregation": options["aggregation"] if "aggregation" in options else {"function": "sum"},
            "attributes": options["attributes"] if "attributes" in options else [],
        }

        changes[f"objectives.{main}.primaries.{primary}.secondaries.{index}"] = prototype
        return changes

    def __handle_secondary_deletion(
        self,
        changes: dict,
        main: str,
        primary: Union[int, str],
        secondary: Union[int, str],
        **kwargs,
    ):
        primary, secondary = int(primary), int(secondary)
        secondaries: list = self.get_content()["objectives"][main]["primaries"][primary]["secondaries"]
        secondaries.remove(secondaries[secondary])

        return changes

    def __handle_attribute_creation(
        self,
        changes: dict,
        main: str,
        primary: Union[int, str],
        secondary: Union[int, str],
        options: dict = {},
        **kwargs,
    ):
        primary, secondary = int(primary), int(secondary)

        primaries = self.get_content()["objectives"][main]["primaries"]
        secondaries = primaries[primary]["secondaries"]
        attributes: list = secondaries[secondary]["attributes"]
        index = 0 if attributes is None else len(attributes)

        prototype = {
            "name": options["name"] if "name" in options else f"Attribute ({index + 1})",
            "dataset": options["dataset"] if "dataset" in options else None,
            "weight": options["weight"] if "weight" in options else 1,
            "scale": options["scale"] if "scale" in options else {"function": "x"},
        }

        changes[f"objectives.{main}.primaries.{primary}.secondaries.{secondary}.attributes.{index}"] = prototype
        return changes

    def __handle_attribute_deletion(
        self,
        changes: dict,
        main: str,
        primary: Union[int, str],
        secondary: Union[int, str],
        attribute: Union[int, str],
        **kwargs,
    ):
        primary, secondary, attribute = int(primary), int(secondary), int(attribute)

        primaries = self.get_content()["objectives"][main]["primaries"]
        secondaries = primaries[primary]["secondaries"]
        attributes: list = secondaries[secondary]["attributes"]
        attributes.remove(attributes[attribute])

        return changes

    def __handle_any_change(self, changes: dict):
        if isinstance(changes, dict) and changes:
            changes["analysis.modifiedOn"] = str(datetime.date(datetime.now()))
        return changes

    def __get_value(self, key):
        segments = key.split(".")
        scope = self.content
        for segment in segments[:-1]:
            if segment not in scope:
                return None
            scope = scope[segment]
        return scope[segments[-1]]

    def __handle_study_area_change(self, changes: dict):
        study_area_key = "analysis.studyArea"
        if study_area_key in changes and changes[study_area_key] != self.__get_value(study_area_key):
            study_area_uri = changes[study_area_key]
            study_area_root = "map.layers.overlays.studyArea"
            if study_area_uri is not None:
                geojson = StudyAreaHelper.convert_to_geojson(study_area_uri[len("file://") :])
                changes[f"{study_area_root}.geojson"] = geojson
                changes[f"{study_area_root}.name"] = "Study Area"
                changes[f"{study_area_root}.checked"] = True
                changes[f"{study_area_root}.center"] = StudyAreaHelper.get_center_from_geojson(geojson)
            else:
                changes[study_area_key] = None
                changes[study_area_root] = None

        return changes

    def __handle_create_directive(self, changes: dict):
        if ":create" in changes:
            payload = changes[":create"]
            del changes[":create"]

            changes = self.supported_create_types[payload["type"]](changes, **payload)

        return changes

    def __handle_delete_directive(self, changes: dict):
        if ":delete" in changes:
            payload = changes[":delete"]
            del changes[":delete"]

            changes = self.supported_delete_types[payload["type"]](changes, **payload)

        return changes

    def __handle_run_directive(self, changes: dict):
        if ":run" in changes:
            payload = changes[":run"]
            del changes[":run"]

            changes = self.supported_run_types[payload["type"]](changes, **payload)

        return changes

    def __handle_run_analysis(self, changes: dict, options: dict = {}, **kwargs):
        tasker = TasksManager(self.tenant_id)
        logger = LogsManager(self.tenant_id)

        def on_complete(result):
            if not "results" in self.content["map"]["layers"]:
                self.content["map"]["layers"]["results"] = {}

            for key, value in result.items():
                keys = key.split(".")
                self.content["map"]["layers"]["results"]["/".join([keys[0]] + keys[1:][::2])] = {
                    "name": keys[-1],
                    "geojson": value,
                    "checked": False,
                }
            if keys is not None and len(keys) > 0:
                self.content["map"]["layers"]["results"][keys[0]]["checked"] = True

        content = self.get_content()
        analysis_name = content["analysis"]["name"]
        cell_size = content["map"]["cellSize"]
        study_area_path = uri_to_path(content["analysis"]["studyArea"])
        objectives = content["objectives"]["needs"]

        tasker.add_task(
            Analysis(self.tenant_id).compute_suitability(
                raw_objectives=objectives, cell_size=cell_size, study_area_path=study_area_path
            ),
            display_name=f"Analysis: {analysis_name}",
            on_complete=lambda result, *_, **__: on_complete(result),
        )

        return changes

    def __handle_map_click(self, changes: dict):
        if "map.lastClick.coords" in changes:
            coords = changes["map.lastClick.coords"]
            changes["map.lastClick.meta"] = Analysis(self.tenant_id).get_informations_at_position(
                coords["lat"], coords["long"]
            )

        return changes

    def _handle_event(self, changes: dict):
        if self.pre_update_hooks is not None:
            changes = reduce(lambda changes, hook: hook(changes), self.pre_update_hooks, changes)

        for segments in [
            [int(segment) if segment.isdigit() else segment for segment in segments]
            for segments in filter(None, [key.split(".") for key in changes.keys()])
        ]:
            scope = self.get_content()
            for segment in segments[:-1]:

                if isinstance(scope, dict) and segment not in scope or not isinstance(scope[segment], (dict, list)):
                    scope[segment] = {}
                elif isinstance(scope, list) and segment == len(scope):
                    scope.append({})

                scope = scope[segment]

            res = changes[".".join(map(str, segments))]
            if isinstance(scope, list) and segments[-1] >= len(scope):
                scope.append(res)
            else:
                scope[segments[-1]] = res

        return changes and segments is not None
