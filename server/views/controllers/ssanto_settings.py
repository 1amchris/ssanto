from documents.editors.document_editor import DocumentEditor
from views.controllers.view_controller import ViewController


class SSantoSettingsViewController(ViewController):
    def _get_view_type(self):
        return "ssanto-settings"

    def _get_content(self):
        try:
            return {
                "analysis": self.document.content["analysis"],
                "map": {"cellSize": self.document.content["map"]["cellSize"]},
            }
        except Exception:
            return super()._get_content()

    def _on_document_change(self, document: DocumentEditor):
        self.content = self._get_content()
        super()._on_document_change(document)
