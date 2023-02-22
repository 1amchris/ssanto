from uuid import uuid4
from logger.manager import LogsManager

from singleton import TenantInstance, TenantSingleton
from subjects.manager import SubjectsManager


class BlobsManager(TenantInstance, metaclass=TenantSingleton):
    def __init__(self, tenant_id):
        super().__init__(tenant_id)
        self.__subjects = SubjectsManager(tenant_id)
        self.__logger = LogsManager(tenant_id)
        self.__objects = {}
        self.__object_ids = self.__subjects.create("blobber.object_ids", self.get_uris())
        self.__needs_update = False

        self.__logger.info("[Blob Manager] initialized.")

    def __generate_uri(self):
        return f"blob://{uuid4()}"

    def get_uris(self):
        uris = list(self.__objects.keys())
        self.__logger.info(f"[Blob Manager] Fetched all blob uris")
        return uris

    def get(self, uri, fail_quietly=False):
        try:
            value = self.__objects[uri]
            self.__logger.info(f"[Blob Manager] Fetched blob with uri {uri}")
            return value

        except ValueError as e:
            if not fail_quietly:
                self.__logger.error(f"[Blob Manager] Blob not found {uri}")
                raise e from None

    def notify(self):
        if self.__needs_update:
            self.__object_ids.notify(self.get_uris())
            self.__needs_update = False

    def insert(self, value, prevent_notify=False):
        uri = self.__generate_uri()
        self.__objects[uri] = value
        self.__logger.info(f"[Blob Manager] Inserted blob with uri {uri}")
        self.__needs_update = True
        if not prevent_notify:
            self.notify()

        return uri

    def delete(self, uri, fail_quietly=False, prevent_notify=False):
        try:
            deleted = self.__objects.pop(uri)
            self.__logger.info(f"[Blob Manager] Removed blob with uri {uri}")
            self.__needs_update = True
            if not prevent_notify:
                self.notify()
            return deleted

        except ValueError as e:
            if not fail_quietly:
                self.__logger.error(f"[Blob Manager] Blob not found {uri}")
                raise e from None

    def unblobify(self, obj):
        if type(obj) is str:
            if obj.startswith("blob://"):
                self.__logger.info(f"[Blob Manager] Unblobifying blob with uri {obj}")
                return self.get(obj)
        elif type(obj) is dict:
            self.__logger.info(f"[Blob Manager] Unblobifying object with keys {list(obj.keys())}")
            return {key: self.unblobify(value) for key, value in obj.items()}

        self.__logger.info(f"[Blob Manager] Unblobifying object")
        return obj
