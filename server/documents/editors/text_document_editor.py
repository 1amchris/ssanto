from files.document_editors.document_editor import DocumentEditor


class TextDocumentEditor(DocumentEditor):
    def _update(self, changes: dict):
        if self.content != changes["content"]:
            self.content = changes["content"]
            return True
        return False
