from enum import Enum
from typing import Callable
from files.serializable import Serializable
from files.utils import uri_to_path


class DocumentEvent(Enum):
    SAVE = "save"
    UPDATE = "update"


class DocumentSubscription:
    def __init__(self, callback: Callable):
        self.callback = callback

    def __call__(self, *args, **kwargs):
        if self.callback is not None:
            self.callback(*args, **kwargs)

    def __bool__(self):
        return self.callback is not None

    def unsubscribe(self):
        self.callback = None


class DocumentEditor(Serializable):
    def __init__(self, uri: str):
        self.uri: str = uri
        self.is_modified: bool = False
        self.content = self.read_from_file()
        self.__subscriptions: dict[DocumentEvent : list[DocumentSubscription]] = {}

    def serialize(self) -> dict:
        return {"uri": self.uri, "is_modified": self.is_modified, "content": self.content}

    def subscribe(self, event: DocumentEvent, callback: Callable, latent: bool = False) -> DocumentSubscription:
        if event not in self.__subscriptions:
            self.__subscriptions[event] = []
        subscription = DocumentSubscription(callback)
        self.__subscriptions[event].append(subscription)
        if not latent:
            subscription(self)
        return subscription

    # The "changes" dictionary is a dictionary of changes to be applied to the document
    # There is no standard structure here. It is based on the needs of the derived editor.
    def update_document(self, changes: dict):
        self.__update_document(changes)
        self.is_modified = True
        self.__notify(DocumentEvent.UPDATE)

    def save_changes_to_file(self):
        self.__save_changes_to_file()
        self.is_modified = False
        self.__notify(DocumentEvent.SAVE)

    def read_from_file(self):
        return self.__read_from_file()

    def __notify(self, event: DocumentEvent):
        if event in self.__subscriptions:
            self.__subscriptions = list(filter(None, self.__subscriptions[event]))
            for subscription in self.__subscriptions[event]:
                subscription(self)

    # The following methods should be overriden by the derived editor to specify behaviour
    def __update_document(self, changes: dict):
        raise Exception("Not implemented")

    def __save_changes_to_file(self):
        if self.is_modified:
            with open(uri_to_path(self.uri), "w") as file:
                file.write(self.content)

    def __read_from_file(self):
        with open(uri_to_path(self.uri), "r") as file:
            return file.read()


class TextDocumentEditor(DocumentEditor):
    def __update_document(self, changes: dict):
        self.content = changes["content"]
        self.is_modified = True


class BinaryDocumentEditor(DocumentEditor):
    def __update_document(self, changes: dict):
        self.content = changes["content"]
        self.is_modified = True

    def __save_changes_to_file(self):
        if self.is_modified:
            with open(uri_to_path(self.uri), "wb") as file:
                file.write(self.content)
            self.is_modified = False

    def __read_from_file(self):
        with open(uri_to_path(self.uri), "rb") as file:
            return file.read()
