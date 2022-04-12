import geopandas
from files.file import File
from pandas.api.types import is_numeric_dtype
import os
import math


class Shapefile(File):
    MANDATORY_EXT = {'shp', 'shx', 'dbf'}
    OPTIONAL_EXT = {'prj',
                    'sbn', 'sbx',
                    'fbn', 'fbx',
                    'ain', 'aih',
                    'ixs', 'mxs',
                    'atx', 'xml',  # .shp.xml
                    'cpg', 'qix'}

    def __init__(self, name: str):
        super().__init__(name, bytes())
        self.extensions = set()
        self.files = {}

        self.columns = []
        self.head = []

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
        base.update({'files': [file.serialize() for file in self.get_files(
        )], 'extensions': list(self.extensions)})
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

    def set_feature(self, path):
        df = geopandas.read_file(os.path.join(path, self.name))
        head = df.loc[:, df.columns != "geometry"].head(5).to_dict("index")
        column_names = [s for s in df.columns if s != "geometry"]
        column_types = []
        minimums = []
        maximums = []
        categories = dict()
        for column_name in column_names:
            column = df[column_name]
            min = 0
            max = 0
            if is_numeric_dtype(column):
                if column.isin([0, 1]).all():
                    column_types.append("Boolean")
                    minimums.append(min)
                    maximums.append(max)
                    categories[column_name] = self.getCategories(
                        column_name, df)

                else:
                    column_types.append("Continuous")
                    minimums.append(column.min())
                    maximums.append(column.max())

            else:
                column_types.append("Categorical")
                minimums.append(min)
                maximums.append(max)
                categories[column_name] = self.getCategories(
                    column_name, df)

        column_name = "[None]"
        column_names.append(column_name)
        column_types.append("Boolean")
        minimums.append(min)
        maximums.append(max)
        categories[column_name] = ['1']

        columns = {'column_names': column_names, 'type': column_types,
                   'minimums': minimums, 'maximums': maximums, 'categories': categories}

        self.head = head
        self.columns = columns

    def getCategories(self, column_name, df):
        return [str(category) for category in df[column_name].unique()]

    def get_metadatas(self):
        #print('Column', self.columns)
        return {"name": self.name, "column_names": self.columns["column_names"], "column_names": self.columns["column_names"], 'type': self.columns["type"], 'categories': self.columns["categories"], 'min_value': [math.floor(min_) for min_ in self.columns["minimums"]], 'max_value': [math.ceil(max_) for max_ in self.columns["maximums"]]}

    # def serialize(self):
    #    print('MIN', self.columns["minimums"])
    #    print('MAX', self.columns["maximums"])
    #    # min_value": list(self.columns["minimums"]), "max_value": list(self.columns["maximums"])
    #    return {"id": self.id, "name": self.name, "stem": self.stem, "extension": self.extension, "column_names": self.columns["column_names"], 'type': self.columns["type"], 'categories': self.columns["categories"], 'min_value': [math.floor(min_) for min_ in self.columns["minimums"]], 'max_value': [math.ceil(max_) for max_ in self.columns["maximums"]]}
