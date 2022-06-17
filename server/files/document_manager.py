from typing import Union
from files.document_editor import DocumentEditor
from logger.log_manager import LogsManager
from singleton import Singleton
from subjects.subjects_manager import SubjectsManager


# Maybe the documents manager should be a singleton?
class DocumentsManager:
    def __init__(self, subjects_manager: SubjectsManager, logger: LogsManager):
        self.subjects_manager: LogsManager = subjects_manager
        self.logger: SubjectsManager = logger
        self.documents: dict[str:DocumentEditor] = dict()

        self.logger.info("[Documents] Documents manager initialized")

    def get_document(self, uri: str, open_if_need_be: bool = True) -> DocumentEditor:
        if uri in self.documents:
            document = self.documents[uri]
            self.logger.info(f"[Documents] Fetched existing document: {uri}")
            return document
        elif open_if_need_be:
            document = self.open_document(uri)
            self.logger.info(f"[Documents] Fetched new document: {uri}")
            return document
        else:
            self.logger.error(f"[Documents] No document found: {uri}")
            raise KeyError("No document found: {uri}")

    def update_document(self, uri: str, changes: dict) -> DocumentEditor:
        document = self.get_document(uri)
        document.update_document(changes)
        self.logger.info(f"[Documents] Updated document: {uri}")
        return document

    def open_document(self, uri: str) -> Union[DocumentEditor, None]:
        if uri in self.documents:
            self.logger.info(f"[Documents] Document is already opened: {uri}")
            return self.get_document(uri, False)

        try:
            self.documents[uri] = DocumentEditor(uri)
            self.logger.info(f"[Documents] Opened document: {uri}")
            return self.get_document(uri, False)
        except Exception as e:
            self.logger.info(f"[Documents] Failed to opened document: {e}")
            return None

    def close_document(self, uri: str, save: bool = True) -> str:
        if save:
            self.save_document(uri)

        del self.documents[uri]
        self.logger.info(f"[Documents] Closed document: {uri}")
        return uri

    def save_document(self, uri: str) -> str:
        document = self.get_document(uri, False)
        document.save_changes_to_file()
        self.logger.info(f"[Documents] Saved document: {uri}")

    def save_all(self) -> list[str]:
        uris = [self.save_document(uri) for uri in self.documents]
        self.logger.info(f"[Documents] Saved all opened documents: {len(uris)}")
        return uris
