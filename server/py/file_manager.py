from base64 import b64decode
from geojson_rewind import rewind
import shapefile

from io import BytesIO
from os.path import splitext


class FileParser:
    @staticmethod
    def load(files_manager, full_name):
        name, ext = splitext(full_name)

        if ext == '.shp':
            shp = files_manager.get_file(name+'.shp')
            shx = files_manager.get_file(name+'.shx')
            return FileParser.__load_shp(shp, shx)
        # elif ext == '.'

        return None

    @staticmethod
    def __load_shp(shp_file, shx_file):
        reader = shapefile.Reader(shp=shp_file, shx=shx_file)

        features = []
        for shp in reader.shapes():
            feature = {
                'type':'Feature',
                'geometry': shp.__geo_interface__,
            }
            features.append(feature)

        geojson = {
            "type": "FeatureCollection",
            "features": features
        }
        return rewind(geojson)


class FilesManager:
    def __init__(self):
        self.files = {}

    def get_file(self, name):
        return self.files[name]

    def get_filenames(self):
        return self.files.keys()

    def remove_file(self, name):
        self.files.pop(name)

    def add_file(self, name, data):
        self.files[name] = BytesIO(b64decode(data))

    # Add loaded file to the file manager?
