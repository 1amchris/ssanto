from files.document_editors.document_editor import DocumentEditor
from views.controllers.view_controller import ViewController


class SSantoSettingsViewController(ViewController):
    def get_view_type(self):
        return "ssanto-settings"

    def get_content(self):
        try:
            return {"analysis": self.document.content["analysis"]}
        except Exception:
            return super().get_content()

    def on_document_change(self, document: DocumentEditor):
        self.content = self.get_content()
        super().on_document_change(document)
