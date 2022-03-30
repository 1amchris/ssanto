import geopandas
from py.file import File
from pandas.api.types import is_numeric_dtype
import os


class Shapefile(File):
    def __init__(self, name: str, content: bytes, id=None, group_id=None, dir=None):
        super().__init__(name, content, id=id, group_id=group_id)
        self.dir = dir
        self.columns = []
        self.head = []
        self.set_feature()

    def set_feature(self):
        df = geopandas.read_file(os.path.join(self.dir, self.name))
        try:
            print(df)
            print(df.columns)
        except:
            print('pb')
        else:
            head = df.loc[:, df.columns != "geometry"].head(5).to_dict("index")
            column_names = [s for s in df.columns if s != "geometry"]
            column_types = []
            minimums = dict()
            maximums = dict()
            categories = dict()
            for column_name in column_names:
                column = df[column_name]
                min = None
                max = None
                if is_numeric_dtype(column):
                    if column.isin([0, 1]).all():
                        column_types.append("Boolean")
                        categories[column_name] = self.getCategories(
                            column_name, df)
                    else:
                        column_types.append("Continuous")
                        minimums[column_name] = column.min()
                        maximums[column_name] = column.max()

                else:
                    column_types.append("Categorical")
                    categories[column_name] = self.getCategories(
                        column_name, df)

            columns = {'column_names': column_names, 'type': column_types,
                       'minimums': minimums, 'maximums': maximums, 'categories': categories}

            self.head = head
            self.columns = columns

    def getCategories(self, column_name, df):
        print(column_name, df[column_name].unique())
        return [str(category) for category in df[column_name].unique()]
        # return categories of this colum

    def serialize(self):
        return {"id": self.id, "name": self.name, "stem": self.stem, "extension": self.extension, "column_names": self.columns["column_names"], 'type': self.columns["type"]}
