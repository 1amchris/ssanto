import geopandas
from py.file import File


class Shapefile(File):
    MANDATORY_EXT = {'shp', 'shx', 'dbf'}
    OPTIONAL_EXT = {'prj',
            'sbn','sbx',
            'fbn', 'fbx',
            'ain', 'aih',
            'ixs', 'mxs',
            'atx', 'xml', # .shp.xml
            'cpg', 'qix'}

    def __init__(self, name: str):
        super().__init__(name, bytes())
        self.extensions = set()
        self.files = {}

        self.columns = []
        self.head = []

    # WARNING: self.path doesnt exist!
    def set_head(self):
        df = geopandas.read_file(self.path[0])
        self.head = df.loc[:, df.columns != "geometry"].head(5).to_dict("index")
        print(self.head)

    # WARNING: self.path doesnt exist!
    def set_column(self):
        df = geopandas.read_file(self.path[0])
        self.columns = [s for s in df.columns if s != "geometry"]
        print(self.columns)

    def get_files(self):
        return list(self.files.values())

    def get_file_by_ext(self, ext):
        return self.files[ext]

    def add_file(self, file):
        self.files[file.extension] = file
        self.extensions.add(file.extension)

    def is_complete(self):
        return self.extensions.intersection(Shapefile.MANDATORY_EXT) == Shapefile.MANDATORY_EXT

    def serialize(self):
        base = super().serialize()
        base.update({'files': [file.serialize() for file in self.get_files()], 'extensions': list(self.extensions)})
        return base

    @staticmethod
    def is_shapefile_ext(ext):
        return Shapefile.is_mandatory_ext(ext) or Shapefile.is_optional_ext(ext)

    @staticmethod
    def is_mandatory_ext(ext):
        return ext in Shapefile.MANDATORY_EXT
    
    @staticmethod
    def is_optional_ext(ext):
        return ext in Shapefile.OPTIONAL_EXT