from files.document_editors.document_editor import DocumentEditor


class TextDocumentEditor(DocumentEditor):
    def __update_document(self, changes: dict):
        if self.content != changes["content"]:
            self.content = changes["content"]
            return True
        return False
