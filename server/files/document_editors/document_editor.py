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

    default_view_factory = None

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
        if self.__update_document(changes):
            self.is_modified = True
            self.__notify(DocumentEvent.UPDATE)

    def save_changes_to_file(self):
        if self.__save_changes_to_file():
            self.is_modified = False
            self.__notify(DocumentEvent.SAVE)

    def read_from_file(self):
        return self.__read_from_file()

    def get_default_view_controller(self):
        if self.default_view_factory is None:
            raise ValueError(
                "Property default_view_factory not defined. Don't forget to set the default_view_factory property when initiating a derived document editor. E.g. self.default_view_factory = TextEditorController"
            )
        else:
            return self.default_view_factory

    def __notify(self, event: DocumentEvent):
        if event in self.__subscriptions:
            self.__subscriptions = list(filter(None, self.__subscriptions[event]))
            for subscription in self.__subscriptions[event]:
                subscription(self)

    # The following methods should be overriden by the derived editor to specify behaviour
    def __update_document(self, changes: dict):
        """
        Updates the local document with the changes.
        Returns True if the local document has been succesfully modified, else False.
        """
        raise Exception("Not implemented")

    def __save_changes_to_file(self):
        """
        Saves the document to the source file.
        Returns True if the document has been succesfully saved, else False.
        """
        if self.is_modified:
            with open(uri_to_path(self.uri), "w") as file:
                file.write(self.content)

        return True

    def __read_from_file(self):
        """
        Returns the payload of the `self.content` variable.
        """
        with open(uri_to_path(self.uri), "r") as file:
            return file.read()
