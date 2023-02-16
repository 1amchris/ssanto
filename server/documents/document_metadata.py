from serializable import Serializable


class DocumentMetaData(Serializable):
    def __init__(self, name, path):
        try:
            # will raise ValueError exception if the file name has no extension
            last_period_index = name.rindex(".")
        except ValueError:
            last_period_index = -1

        self.stem = name[:last_period_index] if last_period_index > 0 else name
        self.extension = name[last_period_index + 1 :].lower() if last_period_index > 0 else ""
        self.name: str = f"{self.stem}.{self.extension}" if last_period_index > 0 else self.stem
        self.uri: str = f"file://{path.rstrip('/')}/{self.name}"

    def serialize(self):
        return {"name": self.name, "stem": self.stem, "extension": self.extension, "uri": self.uri}
