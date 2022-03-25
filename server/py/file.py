from base64 import b64encode
from io import BytesIO
import string
from py.file_metadata import FileMetaData


class File(FileMetaData):
    def __init__(self, name: string, content: bytes):
        super().__init__(name)
        self.content = content

    def get_metadata(self):
        return super().serialize()

    def serialize(self):
        base = super().serialize()
        base.update({"content": b64encode(self.read_content()).decode('ascii')})
        return base

    def get_file_descriptor(self):
        return BytesIO(self.content)

    def read_content(self):
        return BytesIO(self.content).read()
