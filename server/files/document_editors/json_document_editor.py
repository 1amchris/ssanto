from files.document_editors.document_editor import DocumentEditor
from files.utils import uri_to_path

import json


class JSONDocumentEditor(DocumentEditor):
    def apply_changes(self, changes: dict):
        if changes:
            self.content.update(changes)
            return True
        return False

    def save_changes(self):
        if self.is_modified:
            with open(uri_to_path(self.uri), "w") as file:
                json.dump(self.content, file)
            return True
        return False

    def read_content(self):
        with open(uri_to_path(self.uri), "r") as file:
            return json.load(file)
