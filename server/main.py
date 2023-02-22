import signal
import platform
import asyncio
from uuid import uuid4

from blobs.manager import BlobsManager
from network.manager import NetworkManager
from subjects.manager import SubjectsManager

from documents.editor_registry import DocumentEditorRegistry
from documents.editors.geojson.geojson_document_editor import GeoJsonDocumentEditor
from documents.editors.sproj.sproj_document_editor import SSantoDocumentEditor

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

    # extensions_uri = views_manager.sidebar.add_activity("Extensions", "VscExtensions")

    views_manager.sidebar.select_activity(explorer_uri, allow_none=False)


async def main():
    tenant_id = str(uuid4())

    server = NetworkManager(tenant_id)
    subjects = SubjectsManager(tenant_id)
    toaster = ToastsManager(tenant_id)
    workspace = WorkspaceManager(tenant_id)
    blobber = BlobsManager(tenant_id)
    advisor = GuideBuilder()

    populate_registries()
    populate_views(workspace.views)

    commands = {
        "subscribe": subjects.subscribe,
        "unsubscribe": subjects.unsubscribe,
        "advisor.get_guide": advisor.get_guide,
        "blobber.get_object": blobber.get,
        "toaster.close_toast": toaster.close_toast,
        "toaster.trigger_action": toaster.trigger_action,
        "workspace.open_view": workspace.open_editor,
        "workspace.open_workspace": workspace.open_workspace,
        "workspace.close_workspace": workspace.close_workspace,
        "workspace.views.handle_event": workspace.views.handle_event,
        "workspace.views.editor.save": workspace.views.editor.save,
        "workspace.views.editor.save_all": workspace.views.editor.save_all,
        "workspace.views.editor.add_group": workspace.views.editor.add_group,
        "workspace.views.editor.select_group": workspace.views.editor.select_group,
        "workspace.views.editor.close_group": workspace.views.editor.remove_group,
        "workspace.views.editor.close_view": workspace.views.editor.remove_view,
        "workspace.views.editor.select_view": workspace.views.editor.select_view,
        "workspace.views.panel.close_view": workspace.views.panel.remove_view,
        "workspace.views.panel.select_view": workspace.views.panel.select_view,
        "workspace.views.panel.select_activity": workspace.views.panel.select_activity,
        "workspace.views.sidebar.close_view": workspace.views.sidebar.remove_view,
        "workspace.views.sidebar.select_view": workspace.views.sidebar.select_view,
        "workspace.views.sidebar.select_activity": workspace.views.sidebar.select_activity,
    }

    for command, handler in commands.items():
        server.bind_command(command, handler)

    # legacy
    # files = FilesManager(subjects, logger)
    # server.bind_command("files.get_files", files.get_files_metadatas)

    # analysis = Analysis(subjects, files)
    # server.bind_command("analysis.update", analysis.update)
    # server.bind_command("analysis.set_study_area", analysis.receive_study_area)
    # server.bind_command("analysis.update_suitability_threshold", analysis.update_suitability_threshold)
    # server.bind_command("analysis.compute_suitability", analysis.compute_suitability)

    # server.bind_command("analysis.get_layer", analysis.get_layer)
    # end: legacy

    # Main loop
    loop = asyncio.get_running_loop()
    stop = loop.create_future()
    # Windows doesn't implement these signals
    if platform.system() != "Windows":
        loop.add_signal_handler(signal.SIGTERM, stop.set_result, None)
        loop.add_signal_handler(signal.SIGINT, stop.set_result, None)

    # DO NOT DELETE. It is used to open the window.
    print("STARTUP_FINISH")
    async with server.serve():
        await stop  # run forever


if __name__ == "__main__":
    NetworkManager.DEFAULT_HOST = "localhost"
    NetworkManager.DEFAULT_PORT = 15649

    asyncio.run(main())
