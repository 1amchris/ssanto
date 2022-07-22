from collections import defaultdict
from typing import Union
from documents.editor_registry import DocumentEditorRegistry
from documents.editors.document_editor import DocumentEditor
from files.errors import UnsavedFileError
from logger.manager import LogsManager
from singleton import TenantInstance, TenantSingleton


class DocumentsManager(TenantInstance, metaclass=TenantSingleton):
    def __init__(self, tenant_id: str):
        super().__init__(tenant_id)
        self.__logger: LogsManager = LogsManager(tenant_id)
        self.__documents_refs: defaultdict[int] = defaultdict(int)
        self.__documents: dict[str:DocumentEditor] = dict()

        self.__logger.info("[Documents] initialized.")

    def get(self, uri: str) -> DocumentEditor:
        if uri in self.__documents:
            document = self.__documents[uri]
            self.__logger.info(f"[Documents] Fetched document: {uri}")
            return document
        else:
            self.__logger.error(f"[Documents] No document found: {uri}")
            raise KeyError(f"No document found: {uri}")

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
        if uri not in self.__documents_refs:
            return uri

        elif self.__documents_refs[uri] == 0:
            del self.__documents_refs[uri]
            return uri

        if save:
            self.save(uri)

        refs = self.__documents_refs[uri]
        if refs == 1:
            if not allow_closing_if_modified and self.__documents[uri].is_modified:
                message = "Document is modified and cannot be closed. Use save=True option to save it automatically or allow_closing_if_modified=True to discard changes."
                self.__logger.error(f"[Documents] {message}")
                raise UnsavedFileError(message)

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
        document.save()
        self.__logger.info(f"[Documents] Saved document: {uri}")
        return uri
