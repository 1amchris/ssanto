from typing import Callable
from uuid import uuid4

from serializable import Serializable
from documents.editors.document_editor import DocumentEditor, DocumentEvent


class ViewController(Serializable):
    def __init__(
        self,
        source: str,
        document: DocumentEditor,
        onchange: Callable = None,
        onsave: Callable = None,
        configs: dict = None,
    ):
        self.name = source[source.rfind("/") + 1 :]
        self.source = source
        self.document = document
        self.configs = configs
        self.content = self._get_content()

        self.onchange = onchange
        self.onsave = onsave

        self.view_type = self._get_view_type()
        self.uri = f"{self.view_type}://{uuid4()}"

        self.subscriptions = (
            [
                self.document.subscribe(DocumentEvent.ERROR, self._on_document_error, latent=True),
                self.document.subscribe(DocumentEvent.EVENT, self._on_document_change),
                self.document.subscribe(DocumentEvent.SAVE, self._on_document_save),
            ]
            if self.document is not None
            else []
        )

    def __del__(self):
        try:
            for subscription in self.subscriptions:
                try:
                    subscription.unsubscribe()
                except:
                    pass
        except Exception as e:
            print(f"An error occured while deleting ViewController: {e}")

    def serialize(self):
        return {
            "name": self.name,
            "uri": self.uri,
            "source": self.source,
            "modified": self.document.is_modified if self.document else False,
            "content": self._get_content(),
            "configs": self._get_configs(),
        }

    def metadata(self):
        return {
            "name": self.name,
            "uri": self.uri,
            "source": self.source,
            "modified": self.document.is_modified if self.document else False,
        }

    def save(self):
        if self.document is not None:
            self.document.save()

    def update(self, changes: dict = None):
        if self.document is not None and changes is not None:
            self.document.handle_event(changes)

    # All derived class should redefine the get_view_type() method to return the name of the view_type it supports
    def _get_view_type(self):
        raise Exception("Not implemented")

    # All derived class should redefine the _get_content() method to return the content of the view
    def _get_content(self):
        """
        This method is called when the view is created or updated, and should return the content of the view
        """
        return None

    def _get_configs(self):
        """
        This method is called when the view is updated, and should return the configs of the view
        """
        return self.configs

    # These methods are called when the view is activated, and when the document is updated
    def _on_document_error(self, document: DocumentEditor, error: Exception):
        raise error

    def _on_document_change(self, document: DocumentEditor):
        if self.onchange is not None:
            self.onchange(self)

    def _on_document_save(self, document: DocumentEditor):
        if self.onsave is not None:
            self.onsave(self)
