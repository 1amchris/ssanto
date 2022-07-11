import os
from files.errors import UnsavedFileError
from files.file_metadata import FileMetaData
from logger.log_manager import LogsManager
from subjects.subjects_manager import SubjectsManager
from toasts_manager import ToastAction
from views.manager import ViewsManager
from toasts_manager import ToastsManager


class WorkspaceManager:
    def __init__(self, subjects: SubjectsManager, logger: LogsManager, views: ViewsManager, toaster: ToastsManager):
        self.subjects = subjects
        self.logger = logger
        self.toaster = toaster
        self.workspace = None
        self.views = views
        self.files = self.subjects.create("workspace.files", dict())

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
