import string
import geopandas
from io import BytesIO
from py.file_metadata import FileMetaData


class File(FileMetaData):
    def __init__(self, name: string, content: bytes, id=None, group_id=None):
        super().__init__(name, id=id, group_id=group_id)
        self.content = content
        ''' Not used?
        self.columns = []
        self.head = []

    def set_head(self):
        df = geopandas.read_file(self.path[0])
        self.head = df.loc[:, df.columns != "geometry"].head(5).to_dict("index")
        print(self.head)

    def set_column(self):
        df = geopandas.read_file(self.path[0])
        self.columns = [s for s in df.columns if s != "geometry"]
        print(self.columns)
        '''

    def __dict__(self):
        base = super().__dict__()
        base.update({"content": self.read_content()})
        return base

    def get_file_descriptor(self):
        return BytesIO(self.content)

    def read_content(self):
        return self.get_file_descriptor().read()
