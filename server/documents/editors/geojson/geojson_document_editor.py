from documents.editors.json.json_document_editor import JSONDocumentEditor
import geopandas as gpd


class GeoJsonDocumentEditor(JSONDocumentEditor):
    default_view = "geojson-map"

    def _handle_event(self, changes: dict):
        super()._handle_event(changes)
        return False  # it is currently impossible to update the file directly from the editor (it's more of a viewer than anything else)

    def _load_content(self):
        geojson = super()._load_content()
        bounds = gpd.GeoDataFrame.from_features(geojson).total_bounds
        return {
            "geojson": geojson,
            "bounds": [
                {"lat": bounds[1], "long": bounds[0]},
                {"lat": bounds[3], "long": bounds[2]},
            ],
        }
