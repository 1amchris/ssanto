from views.controllers.view_controller import ViewController


class UnsupportedViewController(ViewController):
    def get_view_type(self):
        return "unsupported"
