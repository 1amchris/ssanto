import string
from uuid import uuid4


class FileMetaData:
    def __init__(self, name, id=None):
        self.id: string = str(uuid4()) if id is None else id
        self.name: string = name
        self.path: string = None

        last_period_index = self.name.rindex(".")
        self.stem = self.name[:last_period_index] if last_period_index > 0 else self.name
        self.extension = self.name[last_period_index +
                                   1:] if last_period_index > 0 else ""

    def __repr__(self):
        return f"id: {self.id}, name: {self.name}"
