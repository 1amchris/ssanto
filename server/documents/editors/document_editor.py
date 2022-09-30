from enum import Enum
from typing import Callable
from serializable import Serializable
from documents.utils import uri_to_path


class DocumentEvent(Enum):
    SAVE = "save"
    EVENT = "event"
    ERROR = "error"


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

    default_view = None

    def __init__(self, tenant_id: str, uri: str):
        self.tenant_id: str = tenant_id
        self.uri: str = uri
        self.is_modified: bool = False
        self.content = self._load_content()
        self.__subscriptions: dict[DocumentEvent : list[DocumentSubscription]] = {}

    def serialize(self) -> dict:
        return {"uri": self.uri, "is_modified": self.is_modified, "content": self.content}

    def subscribe(
        self, event: DocumentEvent, callback: Callable, latent: bool = False, *args, **kwargs
    ) -> DocumentSubscription:
        if event not in self.__subscriptions:
            self.__subscriptions[event] = []
        subscription = DocumentSubscription(callback)
        self.__subscriptions[event].append(subscription)
        if not latent:
            subscription(self, *args, **kwargs)
        return subscription

    def handle_event(self, params: dict):
        try:
            if self._handle_event(params):
                self.is_modified = True
                self.notify(DocumentEvent.EVENT)
        except Exception as e:
            self.notify(DocumentEvent.ERROR, e)

    def save(self):
        try:
            if self._save():
                self.is_modified = False
                self.notify(DocumentEvent.SAVE)
        except Exception as e:
            self.notify(DocumentEvent.ERROR, e)

    def get_content(self):
        try:
            return self._get_content() if self.content is not None else self._load_content()
        except Exception as e:
            self.notify(DocumentEvent.ERROR, e)

    def get_default_view_type(self) -> str:
        if self.default_view is None:
            raise ValueError(
                'Property default_view not defined. Don\'t forget to set the default_view property when initiating a derived document editor. E.g. self.default_view_factory = "text-editor"'
            )
        else:
            return self.default_view

    def notify(self, event: DocumentEvent, *args, **kwargs):
        if event in self.__subscriptions:
            self.__subscriptions[event] = list(filter(None, self.__subscriptions[event]))
            for subscription in self.__subscriptions[event]:
                subscription(self, *args, **kwargs)

    # The following methods should be overriden by the derived editor to specify behaviour
    def _handle_event(self, params: dict):
        """
        Handles the document event.
        Returns True if the local document has been modified, else False.
        """
        raise Exception("Not implemented")

    def _save(self):
        """
        Saves the document to the source file.
        Returns True if the document has been saved, else False.
        """
        if self.is_modified:
            with open(uri_to_path(self.uri), "w") as file:
                file.write(self.content)

        return True

    def _get_content(self):
        """
        Returns the filtered content of the `self.content` variable.
        """
        return self.content

    def _load_content(self):
        """
        Returns the payload of the `self.content` variable.
        """
        with open(uri_to_path(self.uri), "r") as file:
            return file.read()
