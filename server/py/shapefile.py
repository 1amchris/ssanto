import geopandas
from py.file import File


class Shapefile(File):
    def __init__(self, name: str, content: bytes, id=None, group_id=None):
        super().__init__(name, content, id=id, group_id=group_id)
        self.columns = []
        self.head = []

    def set_head(self):
        df = geopandas.read_file(self.path[0])
        self.head = df.loc[:, df.columns !=
                           "geometry"].head(5).to_dict("index")
        print(self.head)

    def set_column(self):
        df = geopandas.read_file(self.path[0])
        self.columns = [s for s in df.columns if s != "geometry"]
        print(self.columns)
