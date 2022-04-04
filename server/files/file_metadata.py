from files.serializable import Serializable


class FileMetaData(Serializable):
    def __init__(self, name):
        self.name: str = name

        last_period_index = self.name.rindex(".")
        self.stem = self.name[:last_period_index] if last_period_index > 0 else self.name
        self.extension = self.name[last_period_index + 1 :] if last_period_index > 0 else ""

    def serialize(self):
        return {"name": self.name, "stem": self.stem, "extension": self.extension}
