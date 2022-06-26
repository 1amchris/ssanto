from collections import defaultdict
from typing import Union
from files.document_editor_registry import DocumentEditorRegistry
from files.document_editors.document_editor import DocumentEditor
from logger.log_manager import LogsManager


class DocumentsManager:
    def __init__(self, logger: LogsManager):
        self.__logger: LogsManager = logger
        self.__documents_refs: defaultdict[int] = defaultdict(int)
        self.__documents: dict[str:DocumentEditor] = dict()

        self.__logger.info("[Documents] Documents manager initialized")

    def get(self, uri: str) -> DocumentEditor:
        if uri in self.__documents:
            document = self.__documents[uri]
            self.__logger.info(f"[Documents] Fetched document: {uri}")
            return document
        else:
            self.__logger.error(f"[Documents] No document found: {uri}")
            raise KeyError("No document found: {uri}")

    def update(self, uri: str, changes: dict) -> DocumentEditor:
        document = self.get(uri)
        document.update(changes)
        self.__logger.info(f"[Documents] Updated document: {uri}")
        return document

    def open(self, uri: str) -> Union[DocumentEditor, None]:
        try:
            if self.__documents_refs[uri] == 0:
                self.__documents[uri] = DocumentEditorRegistry()[uri](uri)
            self.__documents_refs[uri] += 1
            self.__logger.info(f"[Documents] Opened document [{self.__documents_refs[uri]} refs]: {uri}")
            return self.get(uri)
        except Exception as e:
            print("Cannot open document:", e)
            self.__logger.error(f"[Documents] Failed to opened document: {e}")
            return None

    def close(self, uri: str, save: bool = True, allow_closing_if_modified: bool = False) -> str:
        if save:
            self.save(uri)

        refs = self.__documents_refs[uri]
        if refs == 1:
            if not allow_closing_if_modified and self.__documents[uri].is_modified:
                message = "Document is modified and cannot be closed. Use save=True option to save it automatically or allow_closing_if_modified=True to discard changes."
                self.__logger.error(f"[Documents] {message}")
                raise IOError(message)

            del self.__documents[uri]
            del self.__documents_refs[uri]
            refs = 0

        else:
            self.__documents_refs[uri] -= 1
            refs = self.__documents_refs[uri]

        self.__logger.info(f"[Documents] Closed document [{refs} refs]: {uri}")
        return uri

    def save(self, uri: str) -> str:
        document = self.get(uri)
        document.save_changes_to_file()
        self.__logger.info(f"[Documents] Saved document: {uri}")
        return uri

    def save_all(self) -> list[str]:
        uris = [document.save_changes_to_file() for document in self.__documents.values()]
        self.__logger.info(f"[Documents] Saved documents: {uris}")
        return uris
