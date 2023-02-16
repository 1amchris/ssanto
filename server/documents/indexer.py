from documents.document_metadata import DocumentMetaData
from logger.manager import LogsManager

from singleton import TenantInstance, TenantSingleton

from typing import Optional, Callable


class DocumentIndex:
    def __init__(self, metadata: DocumentMetaData, data=None):
        self.metadata = metadata
        self.data = {} if data is None else data
        self._on_initialized()

    def _on_initialized(self):
        # When the document is first loaded, specify the indexed informations
        # Should be overriden in the daughter class
        pass

    def __update(self, data: dict, upsert=False):
        for segments in [
            [int(segment) if segment.isdigit() else segment for segment in segments]
            for segments in filter(None, [key.split(".") for key in data.keys()])
        ]:
            scope = self.data
            for index, segment in enumerate(segments[:-1]):
                if segment not in scope and upsert is False:
                    raise KeyError(f"There is no entry with key {'.'.join(segments[:index])}")
                elif isinstance(scope, dict) and segment not in scope or not isinstance(scope[segment], (dict, list)):
                    scope[segment] = {}
                elif isinstance(scope, list) and segment == len(scope):
                    scope.append({})

                scope = scope[segment]

            res = data[".".join(map(str, segments))]
            if isinstance(scope, list) and segments[-1] >= len(scope):
                scope.append(res)
            else:
                scope[segments[-1]] = res

    def __delete(self, key: str, remove_key=False):
        scope = self.data
        segments = key.split(".")
        for segment in segments[:-1]:
            scope = scope[segment]

        if remove_key:
            del scope[segments[-1]]
        else:
            scope[segments[-1]] = {}


class DocumentsIndexer(TenantInstance, metaclass=TenantSingleton):
    def __init__(self, tenant_id: str):
        super().__init__(tenant_id)
        self.__logger: LogsManager = LogsManager(tenant_id)
        self.__documents: dict[str, DocumentIndex] = {}

        self.__logger.info("[Indexer] initialized.")

    def update(self, uri: str, data, upsert=False):
        document = self.get(uri)
        try:
            document.__update(data, upsert=upsert)

            self.__logger.info(f"[Indexer] Updated document: {uri}")
        except KeyError as e:
            self.__logger.error(f"[Indexer] {e}")
            raise

    def delete(self, uri: str, key: str, remove_key=False):
        document = self.get(uri)
        document.__delete(key, remove_key=remove_key)

        message = f"[Indexer] Deleted info{' ' if remove_key is False else ' and key '}{key} for document: {uri}"
        self.__logger.info(message)

    def get(self, uri: str) -> Optional[DocumentIndex]:
        if uri in self.__documents:
            return self.__documents[uri]

        message = f"There is no document with uri {uri}"
        self.__logger.error(f"[Indexer] {message}")
        raise KeyError(message)

    def filter(self, function: Callable[[str, object], bool]) -> list[str]:
        filtered = filter(function, self.__documents.values())
        keys = list(map(lambda k, v: k, filtered))
        self.__logger.info(f"[Indexer] Filtered {len(keys)} uris out of {len(self.__documents)} documents")
        return keys
