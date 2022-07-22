from singleton import Singleton
from views.controllers.unsupported import UnsupportedViewController


class ViewControllerRegistry(metaclass=Singleton):

    __reserved_view_types = ["unsupported"]
    __default_view_controller = UnsupportedViewController

    def __init__(self):
        self.__registry = dict()

    def __getitem__(self, view_type):
        return self.get(view_type)

    def __setitem__(self, view_type, view_controller):
        self.register(view_type, view_controller)

    def register(self, view_type, view_controller):
        view_type = self.__normalize_view_type(view_type)
        if view_type in self.__registry:
            raise Exception(f"View type {view_type} already registered. Please unregister it first.")
        elif view_type in self.__reserved_view_types:
            raise Exception(f"View type {view_type} is reserved. Please choose a different view type.")
        else:
            self.__registry[view_type] = view_controller
        return self

    def unregister(self, view_type):
        view_type = self.__normalize_view_type(view_type)
        if view_type in self.__registry:
            del self.__registry[view_type]
        return self

    def get(self, view_type):
        view_type = self.__normalize_view_type(view_type)
        if view_type in self.__registry:
            return self.__registry[view_type]
        else:
            return self.__default_view_controller

    # TODO: We should probably move this to an view_type utils/manager
    def __normalize_view_type(self, view_type: str):
        return view_type.lower().strip() if view_type is not None and isinstance(view_type, str) else "unsupported"
