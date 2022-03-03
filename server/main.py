import signal

import asyncio

from py.logger import *
from py.server_socket import ServerSocket
from py.file_manager import StudyAreaManager, GeoDatabaseManager
from py.subjects_manager import SubjectsManager
from py.subject import Subject


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

    study_area_file_name = subjects_manager.create(
        "study_area.file_name", None)
    study_area_area = subjects_manager.create("study_area.area", {})

    # Le frontend s'abonne à ces variable;
    new_geofile_file_name = subjects_manager.create(
        "new_geo_file.file_name", None)
    new_geofile_data = subjects_manager.create("new_geo_file.data", {})
    new_geofile_index = subjects_manager.create("new_geo_file.index", None)

    deleted_geofile_index = subjects_manager.create(
        "deleted_geo_file.index", None)

    # STUDY AREA
    def handle_study_area_changed(study_area):
        print("handle_study_area_changed")
        if "error" in study_area:
            print(1)
            study_area_file_name.notify({"error": study_area["error"]})
            study_area_area.notify({"error": study_area["error"]})
        else:
            print(2)
            study_area_file_name.notify({"value": study_area["file_name"]})
            study_area_area.notify({"value": study_area["area"]})

    server_socket.bind_command(
        "study_area.files/files", StudyAreaManager(handle_study_area_changed).receive_files)

    # ADD GEOFILE
    def handle_geodatabase_changed(geo_file):
        print("handle_geodatabase_changed")
        print(geo_file)
        if ("add" in geo_file):
            if "error" in geo_file:
                print("if")
                new_geofile_file_name.notify({"error": geo_file["error"]})
                new_geofile_data.notify({"error": geo_file["error"]})
                new_geofile_index.notify({"error": geo_file["error"]})

            else:
                print("else")
                new_geofile_file_name.notify(
                    {"value": geo_file["file_name"]})
                new_geofile_data.notify({"value": geo_file["data"]})
                new_geofile_index.notify({"value": geo_file["index"]})
                print("index: ", geo_file["index"])
        if("remove" in geo_file):
            if "error" in geo_file:
                deleted_geofile_index.notify({"error": geo_file["error"]})
            else:
                print("else")
                deleted_geofile_index.notify({"value": geo_file["index"]})

    server_socket.bind_command(
        "new_geo_file.files/files", GeoDatabaseManager(handle_geodatabase_changed).receive_files)

    # REMOVE GEOFILE
    server_socket.bind_command("deleted_geo_file.index", GeoDatabaseManager(
        handle_geodatabase_changed).deleteFile)

    loop = asyncio.get_running_loop()
    stop = loop.create_future()
    loop.add_signal_handler(signal.SIGTERM, stop.set_result, None)
    loop.add_signal_handler(signal.SIGINT, stop.set_result, None)

    async with server_socket.serve():
        await stop  # run forever


if __name__ == "__main__":
    asyncio.run(main())
