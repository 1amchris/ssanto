from views.controllers.view_controller import ViewController


class SSantoSettingsViewController(ViewController):
    def get_view_type(self):
        return "ssanto-settings"

    def get_content(self):
        try:
            return {"analysis": self.document.content["analysis"]}
        except Exception:
            return super().get_content()
