import signal
import platform
import asyncio
from uuid import uuid4
from documents.editors.geojson_document_editor import GeoJsonDocumentEditor

from network.server_socket import ServerSocket
from subjects.manager import SubjectsManager

from documents.editor_registry import DocumentEditorRegistry
from documents.editors.sproj_document_editor import SSantoDocumentEditor

from logger.logger import *

from guide.builder import GuideBuilder
from toasts.manager import ToastsManager
from views.controllers.geojson_map import GeoJsonMapViewController
from workspace.manager import WorkspaceManager
from views.manager import ViewsManager

from views.builtin import FileExplorerView, FileSearcherView, ProblemExplorerView, OutputView
from views.controllers.ssanto_map import SSantoMapViewController
from views.controllers.ssanto_settings import SSantoSettingsViewController
from views.controllers.ssanto_hierarchy import SSantoHierarchyViewController
from views.controllers.ssanto_attribute import SSantoAttributeViewController
from views.controller_registry import ViewControllerRegistry


def populate_registries():
    # examples of registering new document editors for given extensions
    editor_registry = DocumentEditorRegistry()
    editor_registry["sproj"] = SSantoDocumentEditor
    editor_registry["geojson"] = GeoJsonDocumentEditor

    # example of registering new view controllers for given view types
    controller_registry = ViewControllerRegistry()
    controller_registry["geojson-map"] = GeoJsonMapViewController
    controller_registry["ssanto-map"] = SSantoMapViewController
    controller_registry["ssanto-settings"] = SSantoSettingsViewController
    controller_registry["ssanto-hierarchy"] = SSantoHierarchyViewController
    controller_registry["ssanto-attribute"] = SSantoAttributeViewController


def populate_views(views_manager: ViewsManager):
    # panel
    problems_uri = views_manager.panel.add_activity("Problems", "VscWarning")
    views_manager.panel.add_view(ProblemExplorerView("file:///Users/src/"), problems_uri)

    output_uri = views_manager.panel.add_activity("Output", "VscOutput")
    views_manager.panel.add_view(OutputView("file:///Users/src/"), output_uri)

    views_manager.panel.select_activity(output_uri)

    # sidebar
    explorer_uri = views_manager.sidebar.add_activity("Explorer", "VscFiles")
    views_manager.sidebar.add_view(FileExplorerView("file:///Users/src/"), explorer_uri)

    searcher_uri = views_manager.sidebar.add_activity("Search", "VscSearch")
    views_manager.sidebar.add_view(FileSearcherView("file:///Users/src/"), searcher_uri)

    extensions_uri = views_manager.sidebar.add_activity("Extensions", "VscExtensions")
    # empty on purpose

    views_manager.sidebar.select_activity(explorer_uri, allow_none=False)


async def main():
    tenant_id = str(uuid4())

    server = ServerSocket(tenant_id)
    subjects = SubjectsManager(tenant_id)
    toaster = ToastsManager(tenant_id)
    workspace = WorkspaceManager(tenant_id)

    populate_registries()
    populate_views(workspace.views)

    server.bind_command("subscribe", subjects.subscribe)
    server.bind_command("unsubscribe", subjects.unsubscribe)

    server.bind_command("toaster.close_toast", toaster.close_toast)
    server.bind_command("toaster.trigger_action", toaster.trigger_action)

    server.bind_command("workspace.open_view", workspace.open_editor)
    server.bind_command("workspace.open_workspace", workspace.open_workspace)
    server.bind_command("workspace.close_workspace", workspace.close_workspace)

    server.bind_command("workspace.views.handle_event", workspace.views.handle_event)

    server.bind_command("workspace.views.editor.save", workspace.views.editor.save)
    server.bind_command("workspace.views.editor.save_all", workspace.views.editor.save_all)
    server.bind_command("workspace.views.editor.add_group", workspace.views.editor.add_group)
    server.bind_command("workspace.views.editor.select_group", workspace.views.editor.select_group)
    server.bind_command("workspace.views.editor.close_group", workspace.views.editor.remove_group)
    server.bind_command("workspace.views.editor.close_view", workspace.views.editor.remove_view)
    server.bind_command("workspace.views.editor.select_view", workspace.views.editor.select_view)

    server.bind_command("workspace.views.panel.close_view", workspace.views.panel.remove_view)
    server.bind_command("workspace.views.panel.select_view", workspace.views.panel.select_view)
    server.bind_command("workspace.views.panel.select_activity", workspace.views.panel.select_activity)

    server.bind_command("workspace.views.sidebar.close_view", workspace.views.sidebar.remove_view)
    server.bind_command("workspace.views.sidebar.select_view", workspace.views.sidebar.select_view)
    server.bind_command("workspace.views.sidebar.select_activity", workspace.views.sidebar.select_activity)

    # legacy
    # files = FilesManager(subjects, logger)
    # server.bind_command("files.get_files", files.get_files_metadatas)

    # analysis = Analysis(subjects, files)
    # server.bind_command("analysis.update", analysis.update)
    # server.bind_command("analysis.set_study_area", analysis.receive_study_area)
    # server.bind_command("analysis.update_suitability_threshold", analysis.update_suitability_threshold)
    # server.bind_command("analysis.compute_suitability", analysis.compute_suitability)

    # server.bind_command("analysis.add_files", analysis.add_files, False)
    # server.bind_command("analysis.remove_file", analysis.remove_file, False)

    # server.bind_command("analysis.export_tiff", analysis.export_tiff)
    # server.bind_command("analysis.get_layer", analysis.get_layer)

    # server.bind_command("analysis.save_project", analysis.export_project_save)
    # server.bind_command("analysis.open_project", analysis.import_project_save)

    # map = Map(subjects, analysis.get_informations_at_position)
    # server.bind_command("map.set_cursor", map.set_cursor)
    # end: legacy

    guide_builder = GuideBuilder()
    server.bind_command("guide.get", guide_builder.generate_guide_data)

    # Main loop
    loop = asyncio.get_running_loop()
    stop = loop.create_future()
    # Windows doesn't implement these...
    if platform.system() != "Windows":
        loop.add_signal_handler(signal.SIGTERM, stop.set_result, None)
        loop.add_signal_handler(signal.SIGINT, stop.set_result, None)

    # DO NOT DELETE. It is used to open the window.
    print("STARTUP_FINISH")
    async with server.serve():
        await stop  # run forever


if __name__ == "__main__":
    ServerSocket.DEFAULT_HOST = "localhost"
    ServerSocket.DEFAULT_PORT = 15649

    asyncio.run(main())
