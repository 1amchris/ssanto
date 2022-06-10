import signal
import platform

import asyncio

from network.server_socket import ServerSocket
from subjects.subjects_manager import SubjectsManager

from logger.logger import *
from logger.log_manager import LogsManager

from views.view_manager import View, ViewsManager

from analysis.analysis import Analysis
from analysis.map import Map
from files.file_manager import FilesManager
from guide_builder import GuideBuilder


def populate_views_manager(views_manager: ViewsManager):
    views_manager.add_view(View("Editor.tsx", "file:///Users/src/Editor.tsx"))
    views_manager.add_view(View("EditorGroups.tsx", "file:///Users/src/EditorGroups.tsx"))
    views_manager.add_view(View("Output.tsx", "file:///Users/src/Output.tsx"))
    views_manager.add_view(View("GuideBuilder.py", "file:///Users/src/GuideBuilder.py"))
    group_uri = views_manager.add_group()
    views_manager.add_view(View("main.py", "file:///Users/src/main.py"), group_uri)
    views_manager.add_view(View("ActivityBar.tsx", "file:///Users/src/ActivityBar.tsx"), group_uri)
    views_manager.add_view(View("files.ts", "file:///Users/src/files.ts"), group_uri)


async def main():
    server_socket = ServerSocket("localhost", 15649)
    subjects_manager = SubjectsManager(server_socket)
    logs_manager = LogsManager(subjects_manager)
    views_manager = ViewsManager(subjects_manager, logs_manager)
    files_manager = FilesManager(subjects_manager, logs_manager)

    populate_views_manager(views_manager)

    # TODO: I feel like "file_manager.###" should be "files_manager.###" (like the variable's name)

    server_socket.bind_command("subscribe", subjects_manager.subscribe)
    server_socket.bind_command("unsubscribe", subjects_manager.unsubscribe)

    server_socket.bind_command("files.open_workspace", files_manager.open_workspace)
    server_socket.bind_command("file_manager.get_files", files_manager.get_files_metadatas)
    # server_socket.bind_command("file_manager.add_files", files_manager.add_files, False)
    # server_socket.bind_command("file_manager.remove_file", files_manager.remove_file, False)

    server_socket.bind_command("views_manager.close_view", views_manager.remove_view)
    server_socket.bind_command("views_manager.select_view", views_manager.select_view)

    server_socket.bind_command("logs_manager.add_log", logs_manager.add_log)
    server_socket.bind_command("logs_manager.get_logs", logs_manager.get_logs)

    analysis = Analysis(subjects_manager, files_manager)
    server_socket.bind_command("update", analysis.update)
    server_socket.bind_command("analysis.update_suitability_threshold", analysis.update_suitability_threshold)
    server_socket.bind_command("compute_suitability", analysis.compute_suitability)

    # TODO: This is confusing. "file_manager.add_files" adds files to "analysis". Should be renamed to "analysis.add_files"
    server_socket.bind_command("file_manager.add_files", analysis.add_files, False)
    server_socket.bind_command("file_manager.remove_file", analysis.remove_file, False)

    # TODO: This is confusing. "get_layer" doesn't follow the same format as the others. Should be renamed to "analysis.get_layer"
    server_socket.bind_command("get_layer", analysis.get_layer)

    server_socket.bind_command("analysis.set_study_area", analysis.receive_study_area)
    server_socket.bind_command("analysis.save_project", analysis.export_project_save)
    server_socket.bind_command("analysis.open_project", analysis.import_project_save)
    server_socket.bind_command("analysis.export_tiff", analysis.export_tiff)

    map = Map(subjects_manager, analysis.get_informations_at_position)
    server_socket.bind_command("map.set_cursor", map.set_cursor)

    guide_builder = GuideBuilder()
    server_socket.bind_command("guide.get", guide_builder.generate_guide_data)

    # Main loop
    loop = asyncio.get_running_loop()
    stop = loop.create_future()
    # Windows dont implement these...
    if platform.system() != "Windows":
        loop.add_signal_handler(signal.SIGTERM, stop.set_result, None)
        loop.add_signal_handler(signal.SIGINT, stop.set_result, None)

    # DO NOT DELETE. It is used to open the window.
    print("STARTUP_FINISH")
    async with server_socket.serve():
        await stop  # run forever


if __name__ == "__main__":
    asyncio.run(main())
