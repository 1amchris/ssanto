from documents.editors.document_editor import DocumentEditor
from documents.utils import uri_to_path


class BinaryDocumentEditor(DocumentEditor):
    def _handle_event(self, changes: dict):
        if self.content != changes["content"]:
            self.content = changes["content"]
            return True
        return False

    def _save(self):
        if self.is_modified:
            with open(uri_to_path(self.uri), "wb") as file:
                file.write(self.content)
            return True
        return False

    def _get_content(self):
        with open(uri_to_path(self.uri), "rb") as file:
            return file.read()
