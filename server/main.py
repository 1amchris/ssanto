import signal

import asyncio

from py.logger import *
from py.server_socket import ServerSocket
from py.file_manager import FilesManager
from py.subjects_manager import SubjectsManager

from py.analysis import Analysis
from py.guide_builder import GuideBuilder


async def main():
    server_socket = ServerSocket("localhost", 6969)
    subjects_manager = SubjectsManager(server_socket)
    files_manager = FilesManager(subjects_manager)

    server_socket.bind_command("subscribe", subjects_manager.subscribe)
    server_socket.bind_command("unsubscribe", subjects_manager.unsubscribe)

    server_socket.bind_command("file_manager.get_files", files_manager.get_files_metadatas)
    server_socket.bind_command("file_manager.add_files", files_manager.add_files, False)
    server_socket.bind_command("file_manager.remove_file", files_manager.remove_file)

    analysis = Analysis(subjects_manager, files_manager)
    server_socket.bind_command("update", analysis.update)
    server_socket.bind_command("compute_suitability", analysis.compute_suitability)

    server_socket.bind_command("analysis.set_study_area", analysis.receive_study_area)
    server_socket.bind_command("analysis.save_project", analysis.export_project_save)

    guide_builder = GuideBuilder()
    server_socket.bind_command("guide.get", guide_builder.generate_guide_data)

    # Main loop
    loop = asyncio.get_running_loop()
    stop = loop.create_future()
    loop.add_signal_handler(signal.SIGTERM, stop.set_result, None)
    loop.add_signal_handler(signal.SIGINT, stop.set_result, None)

    async with server_socket.serve():
        await stop  # run forever


if __name__ == "__main__":
    asyncio.run(main())
