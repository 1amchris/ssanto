from uuid import uuid4
from base64 import b64decode
from geojson_rewind import rewind
import os
import shutil
import operator
import shapefile

from py.file import File
from py.shapefile import Shapefile
from py.file_metadata import FileMetaData
from py.serializable import Serializable


class FileParser:
    @staticmethod
    def load(files_manager, *ids):
        files = sorted(
            files_manager.get_files_by_id(*ids), key=lambda file: file.extension
        )

        if files[0].extension == "shp" and len(files) == 2:
            shp, shx = files
            return FileParser.__load_shp(
                shp.get_file_descriptor(), shx.get_file_descriptor()
            )
        # elif ext == '...'

        return None

    @staticmethod
    def __load_shp(shp_file, shx_file):
        reader = shapefile.Reader(shp=shp_file, shx=shx_file)

        features = []
        for shp in reader.shapes():
            feature = {
                "type": "Feature",
                "geometry": shp.__geo_interface__,
            }
            features.append(feature)

        geojson = {"type": "FeatureCollection", "features": features}
        return rewind(geojson)


class FilesWriter:
    def __init__(self):
        self.main_dir = os.path.join(os.getcwd(), "temp")
        if os.path.exists(self.main_dir):
            shutil.rmtree(self.main_dir)
        os.makedirs(self.main_dir)

    def get_path(self):
        return self.main_dir

    def save_file(self, name, content):
        with open(os.path.join(self.main_dir, name), "wb") as file:
            file.write(content)

    def remove_file(self, name):
        os.remove(os.path.join(self.main_dir, name))

    def __del__(self):
        shutil.rmtree(self.main_dir)


class FilesManager:
    def __init__(self, subjects_manager):
        self.subjects_manager = subjects_manager
        self.files_content = dict()
        self.files = self.subjects_manager.create("file_manager.files", dict())
        self.writer = FilesWriter()
        self.shapefiles = self.subjects_manager.create(
            "file_manager.shapefiles", dict()
        )
        self.shapefiles_content = dict()

    def serialize(self) -> dict:
        return {key: file.serialize() for key, file in self.files_content.items()}

    def get_writer_path(self):
        return self.writer.get_path()

    def get_file(self, id):
        return self.files[id]

    def get_files_metadatas(self):
        return list(
            map(
                lambda file: FileMetaData(file.name, id=file.id),
                self.files_content.values(),
            )
        )

    def get_files_by_id(self, *ids):
        return list(filter(lambda file: file.id in ids, self.files_content.values()))

    def get_shapefile_by_id(self, id):
        return list(filter(lambda shapefile: shapefile['id'] == id, self.shapefiles.data))[0]

    def get_file_ids(self):
        return self.files_content.keys()

    def remove_file(self, id):
        popped = self.files_content.pop(id)
        self.writer.remove_file(popped.name)
        self.__notify_metadatas()
        return popped

    def getExtension(self, file_name):
        return file_name.split(".")[-1]

    def getName(self, file_name):
        return file_name.split(".")[0]

    # files: { name: string; size: number; content: string (base64); }[]

    def extractShapefiles(
        self,
    ):
        new_shapefiles = []
        new_shapefiles_content = dict()

        for file in self.files_content.values():
            if self.getExtension(file.name) == "shp":
                try:
                    new_shapefile = Shapefile(file.name, b64decode(
                        file.content), file.id, dir=self.writer.main_dir)
                    dic_new_shapefile = new_shapefile.serialize()
                except:
                    print("invalid shapefile")
                else:
                    new_shapefiles.append(dic_new_shapefile)
                    new_shapefiles_content[new_shapefile.id] = new_shapefile

        self.shapefiles.notify(new_shapefiles)
        self.shapefiles_content = new_shapefiles_content

    def add_files(self, *files):
        created = []
        group_id = str(uuid4())

        for file in files:
            new_file = File(file["name"], b64decode(
                file["content"]), group_id=group_id)
            self.files_content[new_file.id] = new_file
            self.writer.save_file(new_file.name, new_file.read_content())
            created.append(new_file)

        self.extractShapefiles()

        self.__notify_metadatas()
        return created

    def __notify_metadatas(self):
        metadatas = self.get_files_metadatas()
        self.files.notify(metadatas)

    # Add loaded file to the file manager?
