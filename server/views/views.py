from uuid import uuid4
from files.serializable import Serializable


class ViewMetadata(Serializable):
    def __init__(self, source, name=None, view_type=None):
        self.name = name if name is not None else source[source.rfind("/") + 1 :]
        self.source = source
        # self.view_type = (
        #     DefaultViewRegistry().get_view_type(self.source)
        #     if view_type is None
        #     else DefaultViewRegistry().normalize_view_type(view_type)
        # )
        self.view_type = "ssanto-map" if view_type is None else view_type
        self.uri = f"{self.view_type}://{uuid4()}"

    def serialize(self):
        return {"name": self.name, "uri": self.uri, "source": self.source}
