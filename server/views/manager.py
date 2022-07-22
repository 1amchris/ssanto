from serializable import Serializable
from logger.manager import LogsManager
from singleton import TenantInstance, TenantSingleton
from views.managers.editor_manager import EditorManager
from views.managers.sidebar_manager import SideBarManager
from views.managers.panel_manager import PanelManager


class ViewsManager(TenantInstance, Serializable, metaclass=TenantSingleton):
    def __init__(self, tenant_id: str):
        super().__init__(tenant_id)
        self.__logger = LogsManager(tenant_id)

        self.editor = EditorManager(tenant_id)
        self.panel = PanelManager(tenant_id)
        self.sidebar = SideBarManager(tenant_id)

        self.__logger.info("[Views] initialized.")

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
