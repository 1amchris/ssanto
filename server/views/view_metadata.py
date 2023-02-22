from uuid import uuid4
from serializable import Serializable


class ViewMetadata(Serializable):
    def __init__(self, source, view_type, name=None):
        self.name = name if name is not None else source[source.rfind("/") + 1 :]
        self.source = source
        self.view_type = view_type
        self.uri = f"{self.view_type}://{uuid4()}"

    def serialize(self):
        return {"name": self.name, "uri": self.uri, "source": self.source}
