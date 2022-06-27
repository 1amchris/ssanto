from files.serializable import Serializable
from files.document_manager import DocumentsManager
from logger.log_manager import LogsManager
from subjects.subjects_manager import SubjectsManager
from views.components.editor_manager import EditorManager
from views.components.sidebar_manager import SideBarManager
from views.components.panel_manager import PanelManager
from toasts_manager import ToastsManager


class ViewsManager(Serializable):
    def __init__(
        self, subjects: SubjectsManager, logger: LogsManager, documents: DocumentsManager, toaster: ToastsManager
    ):
        super().__init__()
        self.__subjects = subjects
        self.__logger = logger
        self.__documents = documents
        self.__toaster = toaster

        self.editor = EditorManager(subjects, logger, documents, toaster)
        self.panel = PanelManager(subjects, logger, toaster)
        self.sidebar = SideBarManager(subjects, logger, toaster)

        self.__logger.info("ViewManager initialized.")

    def serialize(self) -> dict:
        return {
            "editor": self.editor.serialize(),
            "panel": self.panel.serialize(),
            "sidebar": self.sidebar.serialize(),
        }

    def update(self, view_uri, changes):
        # for manager in [self.sidebar, self.editor, self.panel]:
        for manager in [self.editor]:  # sidebar and panel don't implement has_view and update_view yet
            if manager.has_view(view_uri):
                manager.update_view(view_uri, changes)

        # self.logger.info(f"[Workspace] Updated view: {view_uri}")
