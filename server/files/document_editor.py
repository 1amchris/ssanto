from json import load, dump
from files.serializable import Serializable
from files.utils import uri_to_path


class DocumentEditor(Serializable):
    def __init__(self, uri: str):
        self.uri: str = uri
        self.is_modified: bool = False
        self.content = self.read_from_file()

    def serialize(self) -> dict:
        return {"uri": self.uri, "is_modified": self.is_modified, "content": self.content}

    # The "changes" dictionary is a dictionary of changes to be applied to the document
    # There is no standard structure here. It is based on the needs of the derived editor.
    def update_document(self, changes: dict):
        # self.is_modified = True ...
        raise Exception("Not implemented")

    def save_changes_to_file(self):
        if self.is_modified:
            with open(uri_to_path(self.uri), "w") as file:
                file.write(self.content)
            self.is_modified = False

    def read_from_file(self):
        with open(uri_to_path(self.uri), "r") as file:
            return file.read()


class TextDocumentEditor(DocumentEditor):
    def update_document(self, changes: dict):
        self.content = changes["content"]
        self.is_modified = True


class BinaryDocumentEditor(DocumentEditor):
    def update_document(self, changes: dict):
        self.content = changes["content"]
        self.is_modified = True

    def save_changes_to_file(self):
        if self.is_modified:
            with open(uri_to_path(self.uri), "wb") as file:
                file.write(self.content)
            self.is_modified = False

    def read_from_file(self):
        with open(uri_to_path(self.uri), "rb") as file:
            return file.read()
