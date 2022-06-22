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
