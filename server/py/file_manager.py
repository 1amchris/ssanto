from base64 import b64decode
import json
from geojson_rewind import rewind
import shapefile as ShpLoader
import os
import shutil
import operator

from py.file_metadata import FileMetaData
from py.file import File
from py.shapefile import Shapefile

from py.serializable import Serializable
from py.server_socket import CallException


class FileParser:
    @staticmethod
    def load(file):
        # We only accept shp file groups for now
        if isinstance(file, Shapefile):
            shp = file.get_file_by_ext('shp')
            shx = file.get_file_by_ext('shx')
            return FileParser.__load_shp(shp.get_file_descriptor(), shx.get_file_descriptor())
        # elif ext == '...'

        return None

    @staticmethod
    def __load_shp(shp_file, shx_file):
        reader = ShpLoader.Reader(shp=shp_file, shx=shx_file)

        features = []
        for shp in reader.shapes():
            feature = {
                "type": "Feature",
                "geometry": shp.__geo_interface__,
            }
            features.append(feature)

        geojson = {"type": "FeatureCollection", "features": features}
        data_str = json.dumps(rewind(geojson))
        return bytes(data_str, 'ascii')


class FilesWriter:
    def __init__(self):
        self.main_dir = os.path.join(os.getcwd(), "temp")
        if os.path.exists(self.main_dir):
            shutil.rmtree(self.main_dir)
        os.makedirs(self.main_dir)

    def get_path(self):
        return self.main_dir

    def save_file(self, name, content):
        path = os.path.join(self.main_dir, name)
        is_overwritten = os.path.exists(path)
        with open(path, 'wb') as file:
            file.write(content)
        return is_overwritten

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

    def get_file(self, name):
        return self.files_content[name]

    def get_files_metadatas(self):
        return list(
            map(
                lambda file: FileMetaData(file.name),
                self.files_content.values(),
            )
        )

    def get_files_by_names(self, *names):
        return list(filter(lambda file: file.name in names, self.files_content.values()))

    #def get_shapefile_by_id(self, id):
    #    return list(filter(lambda shapefile: shapefile['id'] == id, self.shapefiles.data))[0]

    def get_file_names(self):
        return self.files_content.keys()

    def remove_file(self, name):
        popped = self.files_content.pop(name)
        # It is not elegant, but we need to implement composite in the self.files_content
        if isinstance(popped, Shapefile):
            for file in popped.get_files():
                self.writer.remove_file(file.name)
        else: # Probably not used since only shapefile are allowed
            self.writer.remove_file(popped.name)
        self.__notify_metadatas()
        return popped

    def add_file(self, file):
        self.writer.save_file(file.name, file.read_content())
        self.files_content[file.name] = file
        return file

    def add_shapefile(self, shp):
        for file in shp.get_files():
            self.writer.save_file(file.name, file.read_content())
        self.files_content[shp.name] = shp
        return shp

    def add_shapefile_from_save(self, name, data):
        shp = Shapefile(name)
        content = data["content"]
        shp.content = b64decode(content.encode('ascii'))
        for file_data in data['files']:
            file = File(file_data['name'], b64decode(file_data["content"].encode('ascii')))
            shp.add_file(file)

        self.add_shapefile(shp)
        self.__notify_metadatas()

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
        appended = []
        contains_invalid_file = False

        created = {}
        for file in files:
            new_file = File(file["name"], b64decode(file["content"]))
            created[new_file.name] = new_file

        shapefiles = dict()
        for file in created.values():
            if Shapefile.is_shapefile_ext(file.extension):
                shapefile = shapefiles.setdefault(file.stem, Shapefile(file.stem+'.shp'))
                shapefile.add_file(file) # TODO: Check if there is already a file with the extension added
            else:
                contains_invalid_file = True
        
        contains_invalid_shapefile = False
        for shapefile in shapefiles.values():
            if not shapefile.is_complete():
                contains_invalid_shapefile = True
                continue
            is_already_added = True if shapefile.name in self.files_content else False
            self.add_shapefile(shapefile)
            shapefile.content = FileParser.load(shapefile)
            shapefile.set_feature(self.get_writer_path())
            if (not is_already_added):
                appended.append(shapefile)

        self.__notify_metadatas()

        error = ""
        if contains_invalid_shapefile:
            error += "At least one of the provided shapefile is not complete. You must at least have a '.shp', '.shx' and '.dbf'."
        if contains_invalid_file:
            error += "At least one of the provided file is not accepted. Only the shapefile format is accepted."
        if contains_invalid_shapefile or contains_invalid_file:
            raise CallException(error)

        return appended

    def __notify_metadatas(self):
        metadatas = self.get_files_metadatas()
        self.files.notify(metadatas)

    # Add loaded file to the file manager?
