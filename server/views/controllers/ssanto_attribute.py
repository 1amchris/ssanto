from files.document_editors.document_editor import DocumentEditor
from views.controllers.view_controller import ViewController


class SSantoAttributeViewController(ViewController):
    def get_view_type(self):
        return "ssanto-attribute"

    def get_content(self):
        try:
            objectives = self.document.content["objectives"][self.configs["main"]]
            primary = objectives["primaries"][self.configs["primary"]]
            secondary = primary["secondaries"][self.configs["secondary"]]
            return secondary["attributes"][self.configs["attribute"]]
        except Exception:
            return super().get_content()

    def on_document_change(self, document: DocumentEditor):
        self.content = self.get_content()
        super().on_document_change(document)
