from files.serializable import Serializable
from files.document_manager import DocumentsManager
from logger.log_manager import LogsManager
from subjects.subjects_manager import SubjectsManager
from views.components.editor_manager import EditorManager
from views.components.sidebar_manager import SideBarManager
from views.components.panel_manager import PanelManager


class ViewsManager(Serializable):
    def __init__(self, subjects: SubjectsManager, logger: LogsManager, documents: DocumentsManager):
        super().__init__()
        self.subjects = subjects
        self.logger = logger
        self.documents = documents

        self.editor = EditorManager(subjects, logger, documents)
        self.panel = PanelManager(subjects, logger)
        self.sidebar = SideBarManager(subjects, logger)

        self.logger.info("ViewManager initialized.")

    def serialize(self) -> dict:
        return {
            "editor": self.editor.serialize(),
            "panel": self.panel.serialize(),
            "sidebar": self.sidebar.serialize(),
        }

    def update(self, view_uri, changes):
        for manager in [self.sidebar, self.editor, self.panel]:
            try:
                if manager.has_view(view_uri):
                    manager.update_view(view_uri, changes)
            except AttributeError:
                # ignore all managers that don't have a `has_view` method or don't have a `update_view` method
                pass

        self.logger.info(f"[Workspace] Updated view: {view_uri}")
