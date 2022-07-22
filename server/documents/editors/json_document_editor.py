from documents.editors.document_editor import DocumentEditor
from documents.utils import uri_to_path

import json


class JSONDocumentEditor(DocumentEditor):
    def _handle_event(self, changes: dict):
        if changes:
            self.content.update(changes)
            return True
        return False

    def _save(self):
        if self.is_modified:
            with open(uri_to_path(self.uri), "w") as file:
                json.dump(self.content, file)
            return True
        return False

    def _get_content(self):
        with open(uri_to_path(self.uri), "r") as file:
            return json.load(file)
