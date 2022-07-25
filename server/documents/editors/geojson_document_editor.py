from documents.editors.json_document_editor import JSONDocumentEditor


class GeoJsonDocumentEditor(JSONDocumentEditor):
    default_view = "geojson-map"
