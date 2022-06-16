from file_utils import uri_to_path
from logger.log_manager import LogsManager
from subjects.subjects_manager import SubjectsManager


class DocumentEditor:
    # Custom DocumentEditors should override this classe's methods to alter it's behavior if need be
    def __init__(self, uri: str):
        self.uri: str = uri
        self.is_modified: bool = False
        self.content = self.read_from_file()

    # The "changes" dictionary is a dictionary of changes to be applied to the document
    # There is no standard structure here. It is based on the needs of the editor.
    def update_document(self, changes: dict):
        # self.is_modified = True ...
        raise Exception("Not implemented")

    def save_changes_to_file(self):
        with open(uri_to_path(self.uri), "w") as file:
            file.write(self.content)
        self.is_modified = False

    def read_from_file(self):
        with open(uri_to_path(self.uri), "r") as file:
            return file.read()


class DocumentManager:
    def __init__(self, subjects_manager: SubjectsManager, logs_manager: LogsManager):
        self.subjects_manager: LogsManager = subjects_manager
        self.logs_manager: SubjectsManager = logs_manager
        self.documents: dict[str:DocumentEditor] = dict()

    def get_document(self, uri: str, open_if_need_be: bool = True) -> DocumentEditor:
        if uri in self.documents:
            return self.documents[uri]
        elif open_if_need_be:
            return self.open_document(uri)
        else:
            raise KeyError("Document not found")

    def update_document(self, uri: str, changes: dict):
        document = self.get_document(uri)
        document.update_document(changes)

    def open_document(self, uri: str) -> DocumentEditor:
        if uri in self.documents:
            return self.get_document(uri, False)

        self.documents[uri] = DocumentEditor(uri)

    def close_document(self, uri: str, save: bool = True) -> str:
        if save:
            self.save_document(uri)

        del self.documents[uri]

    def save_document(self, uri: str) -> str:
        document = self.get_document(uri, False)
        document.save_changes_to_file()
