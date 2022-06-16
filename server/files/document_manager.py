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

        self.logs_manager.info("[Documents] Documents manager initialized")

    def get_document(self, uri: str, open_if_need_be: bool = True) -> DocumentEditor:
        if uri in self.documents:
            document = self.documents[uri]
            self.logs_manager.info(f"[Documents] Fetched existing document: {uri}")
            return document
        elif open_if_need_be:
            document = self.open_document(uri)
            self.logs_manager.info(f"[Documents] Fetched new document: {uri}")
            return document
        else:
            self.logs_manager.error(f"[Documents] No document found: {uri}")
            raise KeyError("No document found: {uri}")

    def update_document(self, uri: str, changes: dict) -> DocumentEditor:
        document = self.get_document(uri)
        document.update_document(changes)
        self.logs_manager.info(f"[Documents] Updated document: {uri}")
        return document

    def open_document(self, uri: str) -> DocumentEditor:
        if uri in self.documents:
            self.logs_manager.info(f"[Documents] Document is already opened: {uri}")
            return self.get_document(uri, False)

        self.documents[uri] = DocumentEditor(uri)
        self.logs_manager.info(f"[Documents] Opened document: {uri}")
        return self.get_document(uri, False)

    def close_document(self, uri: str, save: bool = True) -> str:
        if save:
            self.save_document(uri)

        del self.documents[uri]
        self.logs_manager.info(f"[Documents] Closed document: {uri}")
        return uri

    def save_document(self, uri: str) -> str:
        document = self.get_document(uri, False)
        document.save_changes_to_file()
        self.logs_manager.info(f"[Documents] Saved document: {uri}")

    def save_all(self) -> list[str]:
        uris = [self.save_document(uri) for uri in self.documents]
        self.logs_manager.info(f"[Documents] Saved all opened documents: {len(uris)}")
        return uris
