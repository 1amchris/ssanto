from uuid import uuid4
from base64 import b64decode
from geojson_rewind import rewind
import shapefile
import os
import shutil

from py.file import File
from py.file_metadata import FileMetaData


class FileParser:
    @staticmethod
    def load(files_manager, *ids):
        files = sorted(files_manager.get_files_by_id(*ids), key=lambda file: file.extension)

        if files[0].extension == "shp" and len(files) == 2:
            shp, shx = files
            return FileParser.__load_shp(shp.get_file_descriptor(), shx.get_file_descriptor())
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
        self.main_dir = os.path.join(os.getcwd(),'temp')
        if os.path.exists(self.main_dir):
            shutil.rmtree(self.main_dir)
        os.makedirs(self.main_dir)

    def get_path(self):
        return self.main_dir

    def save_file(self, name, content):
        with open(os.path.join(self.main_dir, name), 'wb') as file:
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

    def __dict__(self) -> dict:
        return {key: file.__dict__() for key, file in self.files_content.items()}

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

    def get_file_ids(self):
        return self.files_content.keys()

    def remove_file(self, id):
        popped = self.files_content.pop(id)
        self.writer.remove_file(popped.name)
        self.__notify_metadatas()
        return popped

    # files: { name: string; size: number; content: string (base64); }[]
    def add_files(self, *files):
        created = []
        # print("add_files", self.temp_dir)
        group_id = str(uuid4())
        for file in files:
            new_file = File(file["name"], b64decode(file["content"]), group_id=group_id)
            self.files_content[new_file.id] = new_file
            self.writer.save_file(new_file.name, new_file.read_content())
            #new_file.path = self.save_files_locally(self.temp_dir, group_id, new_file.id)
            # print("add_files", new_file.path)
            # if new_file.extension == "shp":
            #     new_file.set_column()
            #     new_file.set_head()
            created.append(new_file)

        # creer un object shapefile (différents fichiers, path/noms sont conformes)

        self.__notify_metadatas()
        return created

    def __notify_metadatas(self):
        metadatas = self.get_files_metadatas()
        # we need to manually call __dict__ for some unknown reason.
        # It doesn't seem to play nice otherwise
        self.files.notify([metadata.__dict__() for metadata in metadatas])

    # Add loaded file to the file manager?
