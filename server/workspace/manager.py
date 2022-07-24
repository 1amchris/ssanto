import os
from typing import Union
from documents.errors import UnsavedFileError
from files.file_metadata import FileMetaData
from logger.manager import LogsManager
from singleton import TenantInstance, TenantSingleton
from subjects.manager import SubjectsManager
from toasts.manager import ToastAction
from views.manager import ViewsManager
from toasts.manager import ToastsManager


class WorkspaceManager(TenantInstance, metaclass=TenantSingleton):
    def __init__(self, tenant_id: str):
        super().__init__(tenant_id)
        self.subjects = SubjectsManager(tenant_id)
        self.logger = LogsManager(tenant_id)
        self.toaster = ToastsManager(tenant_id)
        self.views = ViewsManager(tenant_id)
        self.workspace = None
        self.files = self.subjects.create("workspace.files", dict())

    def get_workspace_path(self) -> Union[str, None]:
        return self.workspace

    def open_workspace(self, path):
        if self.workspace is not None:
            self.close_workspace()

        self.workspace = path
        all_files = [FileMetaData(file, root) for root, dirs, files in os.walk(path) for file in files]
        self.files.notify(all_files)
        self.logger.info(f"[Workspace] Opened workspace: {self.workspace}")

    def close_workspace(self, save=False, allow_closing_if_modified=False):
        if self.workspace is not None:
            try:
                self.views.editor.remove_all(save=save, allow_closing_if_modified=allow_closing_if_modified)
                self.files.notify([])
                self.workspace = None
                self.toaster.clear_toasts()
                self.logger.info(f"[Workspace] Closed the workspace.")

            except UnsavedFileError as e:
                self.logger.error(
                    f"[Workspace] An attempt at closing the workspace was made. The operation failed, as one or many documents contained unsaved modifications."
                )
                self.toaster.error(
                    message=f"Unsaved modifications in the workspace. What would you like to do?",
                    duration=None,
                    actions=[
                        ToastAction("Save and close", lambda *_, **__: self.close_workspace(save=True)),
                        ToastAction(
                            "Close without saving",
                            lambda *_, **__: self.close_workspace(save=False, allow_closing_if_modified=True),
                        ),
                        ToastAction("Cancel", None),
                    ],
                )

            except IOError as e:
                print(f"Failed to close workspace: {e}")
                self.logger.error(f"[Workspace] Failed to close workspace: {e}")

    def open_editor(self, document_uri: str, view_type: str = None, view_configs: dict = None):
        self.views.editor.add_view(document_uri, view_type=view_type, view_configs=view_configs)
        self.logger.info(f"[Workspace] Opened view: {document_uri}")
