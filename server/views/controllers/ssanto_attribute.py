from documents.editors.document_editor import DocumentEditor
from views.controllers.view_controller import ViewController


class SSantoAttributeViewController(ViewController):
    def _get_view_type(self):
        return "ssanto-attribute"

    def _get_content(self):
        try:
            objectives = self.document.content["objectives"][self.configs["main"]]
            primary = objectives["primaries"][self.configs["primary"]]
            secondary = primary["secondaries"][self.configs["secondary"]]
            return secondary["attributes"][self.configs["attribute"]]
        except Exception:
            return super()._get_content()

    def _on_document_change(self, document: DocumentEditor):
        self.content = self._get_content()
        super()._on_document_change(document)
