import os
from files.document_manager import DocumentsManager
from files.file_metadata import FileMetaData
from logger.log_manager import LogsManager
from subjects.subjects_manager import SubjectsManager
from views.manager import ViewsManager
from views.views import ViewMetadata


class WorkspaceManager:
    def __init__(self, subjects: SubjectsManager, logger: LogsManager, views: ViewsManager):
        self.subjects = subjects
        self.logger = logger
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

    def close_workspace(self):
        # TODO: Perhaps we should close the views workspace before closing it
        if self.workspace is not None:
            self.files.notify([])
            self.logger.info(f"[Workspace] Closed workspace: {self.workspace}")
            self.workspace = None

    def open_editor(self, document_uri: str, view_type: str = None):
        # view = ViewMetadata(document_uri, view_type=view_type)
        self.views.editor.add_view(document_uri, view_type=view_type)
        self.logger.info(f"[Workspace] Opened view: {document_uri}")
