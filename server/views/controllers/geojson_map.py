from views.controllers.view_controller import ViewController


class GeoJsonMapViewController(ViewController):
    def get_view_type(self):
        return "geojson-map"

    def get_content(self):
        try:
            return self.document.content
        except Exception:
            return super().get_content()
