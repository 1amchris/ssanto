import signal

import asyncio

from py.logger import *
from py.server_socket import ServerSocket
from py.file_manager import StudyAreaManager
from py.subjects_manager import SubjectsManager
from py.subject import Subject


### For test purposes


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

    server_socket.bind_command("a_class.method", AClass().method)
    server_socket.bind_command("function", function)

    # Analysis
    def notify(subject: Subject):
        def callback(value):
            subject.notify({"value": value})

        return callback

    # subjects = []
    for key, value in {
        "parameters.analysis_name": "",
        "parameters.modeler_name": "",
        "parameters.cell_size": 20,
        "nbs_system.system_type": "2",
    }.items():
        subject = subjects_manager.create(key, {"value": value})
        server_socket.bind_command(key, notify(subject))

    study_area_file_name = subjects_manager.create("study_area.file_name", None)
    study_area_area = subjects_manager.create("study_area.area", {})

    def handle_study_area_changed(study_area):
        if "error" in study_area:
            study_area_file_name.notify({"error": study_area["error"]})
            study_area_area.notify({"error": study_area["error"]})
        else:
            study_area_file_name.notify({"value": study_area["file_name"]})
            study_area_area.notify({"value": study_area["area"]})

    server_socket.bind_command("study_area.files/files", StudyAreaManager(handle_study_area_changed).receive_files)

    loop = asyncio.get_running_loop()
    stop = loop.create_future()
    loop.add_signal_handler(signal.SIGTERM, stop.set_result, None)
    loop.add_signal_handler(signal.SIGINT, stop.set_result, None)

    async with server_socket.serve():
        await stop  # run forever


if __name__ == "__main__":
    asyncio.run(main())
