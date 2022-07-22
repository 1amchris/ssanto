from documents.editors.document_editor import DocumentEditor
from views.controllers.view_controller import ViewController


class SSantoHierarchyViewController(ViewController):
    def get_view_type(self):
        return "ssanto-hierarchy"

    def get_content(self):
        try:
            return {"objectives": self.document.content["objectives"]}
        except Exception:
            return super().get_content()

    def on_document_change(self, document: DocumentEditor):
        self.content = self.get_content()
        super().on_document_change(document)
