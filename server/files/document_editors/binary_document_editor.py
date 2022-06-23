from files.document_editors.document_editor import DocumentEditor
from files.utils import uri_to_path


class BinaryDocumentEditor(DocumentEditor):
    def __update_document(self, changes: dict):
        if self.content != changes["content"]:
            self.content = changes["content"]
            return True
        return False

    def __save_changes_to_file(self):
        if self.is_modified:
            with open(uri_to_path(self.uri), "wb") as file:
                file.write(self.content)
            return True
        return False

    def __read_from_file(self):
        with open(uri_to_path(self.uri), "rb") as file:
            return file.read()
