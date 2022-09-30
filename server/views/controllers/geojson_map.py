from views.controllers.view_controller import ViewController


class GeoJsonMapViewController(ViewController):
    def _get_view_type(self):
        return "geojson-map"

    def _get_content(self):
        try:
            return self.document.content
        except Exception:
            return super()._get_content()
