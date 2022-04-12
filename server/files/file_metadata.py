from files.serializable import Serializable


class FileMetaData(Serializable):
    def __init__(self, name):
        last_period_index = name.rindex(".")
        self.stem = name[:last_period_index] if last_period_index > 0 else name
        self.extension = name[last_period_index + 1 :].lower() if last_period_index > 0 else ""
        self.name: str = f"{self.stem}.{self.extension}" if last_period_index > 0 else self.stem

    def serialize(self):
        return {"name": self.name, "stem": self.stem, "extension": self.extension}
