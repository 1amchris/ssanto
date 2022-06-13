from files.serializable import Serializable
from logger.log_manager import LogsManager
from subjects.subjects_manager import SubjectsManager
from views.components.editor_manager import EditorManager
from views.components.sidebar_manager import SideBarManager
from views.components.panel_manager import PanelManager


class ViewsManager(Serializable):
    def __init__(self, subjects_manager: SubjectsManager, logs_manager: LogsManager):
        super().__init__()
        self.subjects_manager = subjects_manager
        self.logs_manager = logs_manager
        self.editor = EditorManager(subjects_manager, logs_manager)
        self.panel = PanelManager(subjects_manager, logs_manager)
        self.sidebar = SideBarManager(subjects_manager, logs_manager)

        self.logs_manager.info("ViewManager initialized.")

    def serialize(self) -> dict:
        return {
            "editor": self.editor.serialize(),
            "panel": self.panel.serialize(),
            "sidebar": self.sidebar.serialize(),
        }
