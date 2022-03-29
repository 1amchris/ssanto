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
            category = []
            min_category = []
            max_category = []
            for column_name in column_names:
                column = df[column_name]
                min = None
                max = None
                if is_numeric_dtype(column):
                    if column.isin([0, 1]).all():
                        category.append("Boolean")
                    else:
                        category.append("Continuous")
                        min = column.min()
                        max = column.max()
                else:
                    category.append("Categorical")
                min_category.append(min)
                max_category.append(max)
            columns = {'column_names': column_names, 'category': category,
                       'min_category': min_category, 'max_category': max_category}

            self.head = head
            self.columns = columns

    def serialize(self):
        return {"id": self.id, "name": self.name, "stem": self.stem, "extension": self.extension, "column_names": self.columns["column_names"], 'category': self.columns["category"]}
