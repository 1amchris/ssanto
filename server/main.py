import signal

import asyncio

from py.logger import *
from py.server_socket import ServerSocket
from py.subjects_manager import SubjectsManager
from py.file_manager import StudyAreaManager


async def main():
    server_socket = ServerSocket("localhost", 6969)

    subjects_manager = SubjectsManager(server_socket)

    server_socket.bind_command_m("subscribe", subjects_manager, SubjectsManager.subscribe)
    server_socket.bind_command_m("unsubscribe", subjects_manager, SubjectsManager.unsubscribe)

    study_area = subjects_manager.create("studyArea", {"fileName": ""})
    server_socket.bind_command_m(
        "study_area",
        StudyAreaManager(study_area.notify),
        StudyAreaManager.receive_files,
    )

    loop = asyncio.get_running_loop()
    stop = loop.create_future()
    loop.add_signal_handler(signal.SIGTERM, stop.set_result, None)

    async with server_socket.serve():
        await stop  # run forever


if __name__ == "__main__":
    print("Hello from python")

    asyncio.run(main())
