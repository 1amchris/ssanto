from singleton import Singleton


class DocumentEditorRegistry(metaclass=Singleton):
    def __init__(self):
        self.__registry = dict()

    def __getitem__(self, extension):
        return self.get(extension)

    def __setitem__(self, extension, document_editor_factory):
        self.register(extension, document_editor_factory)

    def register(self, extension, document_editor_factory):
        extension = self.__normalize_extension(extension)
        if extension in self.__registry:
            raise Exception(f"Extension {extension} already registered. Please unregister it first.")
        else:
            self.__registry[extension] = document_editor_factory
        return self

    def unregister(self, extension):
        extension = self.__normalize_extension(extension)
        if extension in self.__registry:
            del self.__registry[extension]
        return self

    def get(self, extension):
        extension = self.__normalize_extension(extension)
        if extension in self.__registry:
            return self.__registry[extension]
        else:
            raise KeyError(f"Extension {extension} is not registered.")

    # TODO: We should probably move this to an extension utils/manager
    # TODO: We should probably use a more "versatile" extension manager (ex. patterns or similar)
    def __normalize_extension(self, extension):
        return extension.lower().split(".")[-1].strip() if extension is not None else "unsupported"
