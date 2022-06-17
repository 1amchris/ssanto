import signal
import platform

import asyncio

from network.server_socket import ServerSocket
from subjects.subjects_manager import SubjectsManager

from logger.logger import *
from logger.log_manager import LogsManager

from views.builtin import FileExplorerView, FileSearcherView, ProblemExplorerView, OutputView
from views.default_view_registry import DefaultViewRegistry
from views.manager import ViewsManager

from analysis.analysis import Analysis
from analysis.map import Map
from files.file_manager import FilesManager
from files.workspace_manager import WorkspaceManager
from guide_builder import GuideBuilder


def populate_view_registry(view_registry: DefaultViewRegistry):
    # examples of registering new view types for given extensions
    # TODO populate extension manager with actual view types (maybe even user-editable in the future)
    view_registry["sproj"] = "ssanto-map"


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
    server = ServerSocket("localhost", 15649)
    subjects = SubjectsManager(server)
    logger = LogsManager(subjects)
    workspace = WorkspaceManager(subjects, logger)

    populate_view_registry(DefaultViewRegistry())
    populate_views(workspace.views)

    server.bind_command("subscribe", subjects.subscribe)
    server.bind_command("unsubscribe", subjects.unsubscribe)

    server.bind_command("workspace.open_view", workspace.open_view)
    server.bind_command("workspace.open_workspace", workspace.open_workspace)
    server.bind_command("workspace.close_workspace", workspace.close_workspace)

    files = FilesManager(subjects, logger)
    server.bind_command("files.get_files", files.get_files_metadatas)

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

    server.bind_command("logger.add_log", logger.add_log)
    server.bind_command("logger.get_logs", logger.get_logs)

    analysis = Analysis(subjects, files)
    server.bind_command("analysis.update", analysis.update)
    server.bind_command("analysis.set_study_area", analysis.receive_study_area)
    server.bind_command("analysis.update_suitability_threshold", analysis.update_suitability_threshold)
    server.bind_command("analysis.compute_suitability", analysis.compute_suitability)

    server.bind_command("analysis.add_files", analysis.add_files, False)
    server.bind_command("analysis.remove_file", analysis.remove_file, False)

    server.bind_command("analysis.export_tiff", analysis.export_tiff)
    server.bind_command("analysis.get_layer", analysis.get_layer)

    server.bind_command("analysis.save_project", analysis.export_project_save)
    server.bind_command("analysis.open_project", analysis.import_project_save)

    map = Map(subjects, analysis.get_informations_at_position)
    server.bind_command("map.set_cursor", map.set_cursor)

    guide_builder = GuideBuilder()
    server.bind_command("guide.get", guide_builder.generate_guide_data)

    # Main loop
    loop = asyncio.get_running_loop()
    stop = loop.create_future()
    # Windows dont implement these...
    if platform.system() != "Windows":
        loop.add_signal_handler(signal.SIGTERM, stop.set_result, None)
        loop.add_signal_handler(signal.SIGINT, stop.set_result, None)

    # DO NOT DELETE. It is used to open the window.
    print("STARTUP_FINISH")
    async with server.serve():
        await stop  # run forever


if __name__ == "__main__":
    asyncio.run(main())
