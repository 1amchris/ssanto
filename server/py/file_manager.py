import shapefile
from base64 import b64decode
from geojson_rewind import rewind
from io import BytesIO

from py.file import File
from py.file_metadata import FileMetaData


class FileParser:
    @staticmethod
    def load(files_manager, *ids):
        files = sorted(files_manager.get_files_by_id(*ids), key=lambda file: file.extension)

        if files[0].extension == "shp" and len(files) == 2:
            shp, shx = files
            return FileParser.__load_shp(shp.content, shx.content)
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


class FilesManager:
    def __init__(self, subjects_manager):
        self.subjects_manager = subjects_manager
        self.files_content = dict()
        self.files = self.subjects_manager.create("files", self.files_content)

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
        self.__notify_metadatas()
        return popped

    # files: { name: string; size: number; content: string (base64); }[]
    def add_files(self, *files):
        created = []

        for file in files:
            new_file = File(file["name"], BytesIO(b64decode(file["content"])))
            self.files_content[new_file.id] = new_file
            created.append(new_file)

        self.__notify_metadatas()
        return created

    def __notify_metadatas(self):
        self.files.notify(self.get_files_metadatas())

    # Add loaded file to the file manager?
