from io import BytesIO
from py.file_metadata import FileMetaData


class File(FileMetaData):
    def __init__(self, name: str, content: bytes, id=None, group_id=None):
        super().__init__(name, id=id, group_id=group_id)
        self.content = content

    def __dict__(self):
        base = super().__dict__()
        base.update({"content": self.read_content()})
        return base

    def get_file_descriptor(self):
        return BytesIO(self.content)

    def read_content(self):
        return self.get_file_descriptor().read()
