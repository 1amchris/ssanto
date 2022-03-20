from io import BytesIO
import geopandas
from py.file_metadata import FileMetaData


class File(FileMetaData):
    def __init__(self, name, content):
        super().__init__(name)
        self.content: BytesIO = content
        self.columns = []
        self.head = []

    def set_head(self):
        df = geopandas.read_file(self.path[0])
        self.head = df.loc[:, df.columns !=
                           'geometry'].head(5).to_dict("index")
        print(self.head)

    def set_column(self):
        df = geopandas.read_file(self.path[0])
        self.columns = [s for s in df.columns if s != 'geometry']
        print(self.columns)

    def __repr__(self):
        return f"id: {self.id}, name: {self.name}, content: {self.content}, path:{self.path}"
