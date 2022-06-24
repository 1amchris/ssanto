from views.controllers.view_controller import ViewController


class SSantoMapViewController(ViewController):
    def get_view_type(self):
        return "ssanto-map"

    def get_content(self):
        try:
            return {"map": self.document.content["map"], "analysis": self.document.content["analysis"]}
        except Exception:
            return super().get_content()
