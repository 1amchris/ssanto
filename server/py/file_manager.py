#from msilib.schema import File
from pyclbr import Function
from base64 import b64decode
from geojson_rewind import rewind
import uuid

import fiona


class FileManager:
    def __init__(self):
        pass

    def receive_files(self, *files):
        for file in files:
            with open(file["fileName"], "bw") as f:
                f.write(b64decode(file["base64content"]))


class StudyAreaManager(FileManager):
    def __init__(self, callback: Function):
        super().__init__()
        self.callback = callback

    def receive_files(self, *files):
        try:
            super().receive_files(*files)
            shapefiles = [
                (".".join(name.split(".")[:-1]), ext)
                for name, ext in [(file["fileName"], file["fileName"].split(".")[-1]) for file in files]
                if ext == "shp"
            ]

            if len(shapefiles) == 0:
                raise Exception("No shapefiles received.")

            for shapefile, ext in shapefiles[:1]:  # select the first one only
                print("StudyAreaManager: receive_files")
                with fiona.collection(f"{shapefile}.{ext}") as source:
                    geojson = {
                        "type": "FeatureCollection",
                        "features": list(source),
                    }

                # rewind enforces geojson's 2016 standards
                self.callback(
                    {"file_name": shapefile, "area": rewind(geojson)})

        except Exception as e:
            print("STDERR", "Error: ", e)
            self.callback({"error": str(e)})


class GeoDatabaseManager(FileManager):
    def __init__(self, callback: Function):
        super().__init__()
        self.callback = callback
        self.files = []
        # list fichiers importés
        # fichier : nom, type, data, actif ou pas, ++

    def receive_files(self, *files):
        print("receive_files_top", files)
        try:
            super().receive_files(*files)
            shapefiles = [
                (".".join(name.split(".")[:-1]), ext)
                for name, ext in [(file["fileName"], file["fileName"].split(".")[-1]) for file in files]
                if ext == "shp"
            ]

            if len(shapefiles) == 0:
                raise Exception("No shapefiles received.")
            print("GeoDatabaseManager: receive_files")
            for shapefile, ext in shapefiles[:1]:  # select the first one only
                with fiona.collection(f"{shapefile}.{ext}") as source:
                    geojson = {
                        "type": "FeatureCollection",
                        "features": list(source),
                    }

                # rewind enforces geojson's 2016 standards
                newFile = {"file_name": shapefile, "data": rewind(
                    geojson), "index": str(uuid.uuid4()), "add": True}
                self.files.append(newFile)
                print("NewFile: ", newFile)
                self.callback(newFile)

        except Exception as e:
            print("STDERR", "Error: ", e)
            self.callback({"error": str(e), "add": True})

    def deleteFile(self, file_index):
        try:
            self.files = [file for file in self.files if not (
                file['index'] == file_index)]
            self.callback({"index": file_index, "remove": True})
            print(self.files)

        except Exception as e:
            print("STDERR", "Error: ", e)
            self.callback({"error": str(e), "remove": True})
