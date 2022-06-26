from typing import Callable
from uuid import uuid4

from files.serializable import Serializable
from files.document_editors.document_editor import DocumentEditor, DocumentEvent


class ViewController(Serializable):
    def __init__(self, source: str, document: DocumentEditor, onchange: Callable = None, onsave: Callable = None):
        self.name = source[source.rfind("/") + 1 :]
        self.source = source
        self.document = document
        self.content = self.get_content()

        self.onchange = onchange
        self.onsave = onsave

        self.view_type = self.get_view_type()
        self.uri = f"{self.view_type}://{uuid4()}"

        self.subscriptions = (
            [
                self.document.subscribe(DocumentEvent.UPDATE, self.on_document_change),
                self.document.subscribe(DocumentEvent.SAVE, self.on_document_save),
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
            "content": self.content,
        }

    def save(self):
        if self.document is not None:
            self.document.save()

    def update(self, changes: dict = None):
        if self.document is not None and changes is not None:
            self.document.update(changes)

    # All derived class should redefine the get_view_type() method to return the name of the view_type it supports
    def get_view_type(self):
        raise Exception("Not implemented")

    # All derived class should redefine the get_content() method to return the content of the view
    def get_content(self):
        return None

    # All derived class should redefine the methods below if needed
    # These methods are called when the view is activated, and when the document is updated
    def on_document_change(self, document: DocumentEditor):
        if self.onchange is not None:
            self.onchange(self)

    def on_document_save(self, document: DocumentEditor):
        if self.onsave is not None:
            self.onsave(self)
