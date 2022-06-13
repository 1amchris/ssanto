from singleton import Singleton


class ExtensionManager(metaclass=Singleton):
    __extensions = dict()
    __default_view_type = "view"

    def __init__(self):
        self.__extensions = dict()

    def __getitem__(self, extension):
        return self.get_view_type(extension)

    def __setitem__(self, extension, view_type):
        self.register_view_type(extension, view_type)

    def normalize_extension(self, extension):
        return extension.lower().split(".")[-1].strip()

    def normalize_view_type(self, view_type):
        return view_type.lower().split(".")[-1].strip()

    def register_view_type(self, extension, view_type):
        extension = self.normalize_extension(extension)
        view_type = self.normalize_view_type(view_type)
        if extension in self.__extensions:
            raise Exception(f"Extension {extension} already registered")

        self.__extensions[extension] = view_type

    def get_view_type(self, extension):
        extension = self.normalize_extension(extension)
        if extension in self.__extensions:
            return self.__extensions[extension]
        else:
            return self.__default_view_type
