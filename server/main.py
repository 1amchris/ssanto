import signal

import asyncio

from py.logger import *
from py.server_socket import ServerSocket
from py.subjects_manager import SubjectsManager
from py.file_manager import StudyAreaManager


###
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

    server_socket.bind_command("subscribe", subjects_manager.subscribe)
    server_socket.bind_command("unsubscribe", subjects_manager.unsubscribe)

    study_area = subjects_manager.create("studyArea", {"fileName": ""})
    server_socket.bind_command(
        "study_area",
        StudyAreaManager(study_area.notify).receive_files
    )

    server_socket.bind_command("AClass.method", AClass().method)
    server_socket.bind_command("function", function)

    '''
    parameters = {}

    for param in parameters:
        subjects_manager.create("InputField1", {"name": "a", "data": 1})

    subjects_manager.create("parameters", parameters.to_string())
    '''


    loop = asyncio.get_running_loop()
    stop = loop.create_future()
    loop.add_signal_handler(signal.SIGTERM, stop.set_result, None)
    loop.add_signal_handler(signal.SIGINT, stop.set_result, None)

    async with server_socket.serve():
        await stop  # run forever


if __name__ == "__main__":
    print("Hello from python")

    asyncio.run(main())
