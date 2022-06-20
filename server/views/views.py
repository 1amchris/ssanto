from uuid import uuid4
from uuid import uuid4
from files.serializable import Serializable
from views.default_view_registry import DefaultViewRegistry


class ViewMetadata(Serializable):
    def __init__(self, name, source, view_type=None):
        self.name = name
        self.source = source
        self.view_type = (
            DefaultViewRegistry().get_view_type(self.source)
            if view_type is None
            else DefaultViewRegistry().normalize_view_type(view_type)
        )
        self.uri = f"{self.view_type}://{uuid4()}"

    def serialize(self):
        return {"name": self.name, "uri": self.uri, "source": self.source}
