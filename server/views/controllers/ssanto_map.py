from copy import deepcopy
from views.controllers.view_controller import ViewController


class SSantoMapViewController(ViewController):
    def _get_view_type(self):
        return "ssanto-map"

    def _get_content(self):
        try:
            map = deepcopy(self.document.content["map"])
            if "results" in map["layers"]:
                for key, value in map["layers"]["results"].items():
                    map["layers"]["results"][key]["geojson"] = value["geojson"] if value["checked"] == True else None

            return {"map": map, "analysis": self.document.content["analysis"]}
        except Exception:
            return super()._get_content()
