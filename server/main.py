import signal

import asyncio

from py.logger import *
from py.server_socket import ServerSocket
from py.file_manager import FilesManager
from py.subjects_manager import SubjectsManager

from py.analysis import Analysis

# For test purposes


class AClass:
    def __init__(self):
        self.attribute = "myString"

    def method(self):
        print("This method was called from javascript and contain", self.attribute)


def function():
    print("This function was called from javascript")


###


async def main():
    server_socket = ServerSocket("localhost", 6969)

    subjects_manager = SubjectsManager(server_socket)
    files_manager = FilesManager(subjects_manager)

    server_socket.bind_command("subscribe", subjects_manager.subscribe)
    server_socket.bind_command("unsubscribe", subjects_manager.unsubscribe)

    server_socket.bind_command("a_class.method", AClass().method)
    server_socket.bind_command("function", function)

    # TODO: Implement call response (separate variable binding and call responses)
    server_socket.bind_command("update", subjects_manager.update)

    analysis = Analysis(subjects_manager, files_manager)
    server_socket.bind_command("study_area.files", analysis.receive_study_area)

    server_socket.bind_command("file_manager.add_files", files_manager.add_files)
    server_socket.bind_command("file_manager.remove_file", files_manager.remove_file)

    server_socket.bind_command("analysis.create_save", analysis.create_save_file)

    # Main loop
    loop = asyncio.get_running_loop()
    stop = loop.create_future()
    loop.add_signal_handler(signal.SIGTERM, stop.set_result, None)
    loop.add_signal_handler(signal.SIGINT, stop.set_result, None)

    async with server_socket.serve():
        await stop  # run forever

    


if __name__ == "__main__":
    asyncio.run(main())
