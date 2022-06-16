from files.utils import uri_to_path
from files.serializable import Serializable
from logger.log_manager import LogsManager
from subjects.subjects_manager import SubjectsManager


class DocumentEditor(Serializable):
    def __init__(self, uri: str):
        self.uri: str = uri
        self.is_modified: bool = False
        self.content = self.read_from_file()

    def serialize(self):
        return {"uri": self.uri, "is_modified": self.is_modified, "content": self.content}

    # The "changes" dictionary is a dictionary of changes to be applied to the document
    # There is no standard structure here. It is based on the needs of the derived editor.
    def update_document(self, changes: dict):
        # self.is_modified = True ...
        raise Exception("Not implemented")

    def save_changes_to_file(self):
        if self.is_modified:
            with open(uri_to_path(self.uri), "w") as file:
                file.write(self.content)
            self.is_modified = False

    def read_from_file(self):
        with open(uri_to_path(self.uri), "r") as file:
            return file.read()


class DocumentsManager:
    def __init__(self, subjects_manager: SubjectsManager, logs_manager: LogsManager):
        self.subjects_manager: LogsManager = subjects_manager
        self.logs_manager: SubjectsManager = logs_manager
        self.documents: dict[str:DocumentEditor] = dict()

        self.logs_manager.info("Documents manager initialized")

    def get_document(self, uri: str, open_if_need_be: bool = True) -> DocumentEditor:
        if uri in self.documents:
            self.logs_manager.info(f"Fetching existing document with uri: {uri}")
            return self.documents[uri]
        elif open_if_need_be:
            self.logs_manager.info(f"Fetching new document with uri: {uri}")
            return self.open_document(uri)
        else:
            self.logs_manager.error(f"No document found with uri: {uri}")
            raise KeyError("No document found for uri: {uri}")

    def update_document(self, uri: str, changes: dict) -> DocumentEditor:
        document = self.get_document(uri)
        self.logs_manager.info(f"Updating document with uri: {uri}")
        document.update_document(changes)
        return document

    def open_document(self, uri: str) -> DocumentEditor:
        self.logs_manager.info(f"Opening document with uri: {uri}")
        if uri in self.documents:
            self.logs_manager.info(f"Document {uri} already exists. No need to open it.")
            return self.get_document(uri, False)

        self.documents[uri] = DocumentEditor(uri)
        return self.get_document(uri, False)

    def close_document(self, uri: str, save: bool = True) -> str:
        self.logs_manager.info(f"Closing document with uri: {uri}")
        if save:
            self.logs_manager.info(f"Saving document before closing it")
            self.save_document(uri)

        del self.documents[uri]
        return uri

    def save_document(self, uri: str) -> str:
        document = self.get_document(uri, False)
        self.logs_manager.info(f"Saving document with uri: {uri}")
        document.save_changes_to_file()

    def save_all(self) -> list[str]:
        self.logs_manager.info(f"Saving all opened documents")
        return [self.save_document(uri) for uri in self.documents]
