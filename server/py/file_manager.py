from pyclbr import Function
from base64 import b64decode
from geojson_rewind import rewind

import shapefile
from io import BytesIO
from os.path import splitext


class FileManager:
    def __init__(self):
        self.files = {}

    def load_shp(self, name):
        reader = shapefile.Reader(shp=self.files[name + '.shp'], shx=self.files[name + '.shx'])

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

    def get_filenames(self):
        return self.files.keys()

    def remove_file(self, name):
        self.files.pop(name)

    def receive_files(self, *files):
        for file in files:
            self.files[file["fileName"]] = BytesIO(b64decode(file["base64content"]))


class StudyAreaManager(FileManager):
    def __init__(self, callback: Function):
        super().__init__()
        self.callback = callback

    def receive_files(self, *files):
        try:
            super().receive_files(*files)

            shapefiles = [
                name
                for name, ext in [splitext(file["fileName"]) for file in files]
                if ext == ".shp"
            ]

            if len(shapefiles) == 0:
                raise Exception("No shapefiles received.")

            for shapefile in shapefiles:
                geojson = self.load_shp(shapefile)
                self.callback({"file_name": shapefile, "area": geojson})            

        except Exception as e:
            print("STDERR", "Error: ", e)
            self.callback({"error": str(e)})
