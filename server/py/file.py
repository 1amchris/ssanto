from io import BytesIO
from py.file_metadata import FileMetaData


class File(FileMetaData):
    def __init__(self, name, content):
        super().__init__(name)
        self.content: BytesIO = content

    def __repr__(self):
        return f"id: {self.id}, name: {self.name}, content: {self.content}"
