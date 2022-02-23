import signal

import asyncio

from py.logger import *
from py.server_socket import ServerSocket
from py.subjects_manager import SubjectsManager
from py.analysis_manager import AnalysisManager


async def main():
    socket = ServerSocket("localhost", 6969)

    subjects_manager = SubjectsManager(socket)

    socket.bind_command_m("subscribe", subjects_manager, SubjectsManager.subscribe)
    socket.bind_command_m("unsubscribe", subjects_manager, SubjectsManager.unsubscribe)

    analysis = AnalysisManager(subjects_manager, socket)

    loop = asyncio.get_running_loop()
    stop = loop.create_future()
    loop.add_signal_handler(signal.SIGTERM, stop.set_result, None)

    async with socket.serve():
        await stop  # run forever


if __name__ == "__main__":
    asyncio.run(main())
