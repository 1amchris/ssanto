from files.serializable import Serializable
from views.extension_manager import ExtensionManager


class View(Serializable):
    def __init__(self, name, source, view_type=None):
        self.name = name
        self.source = source
        self.view_type = (
            ExtensionManager().get_view_type(self.source)
            if view_type is None
            else ExtensionManager().normalize_view_type(view_type)
        )
        self.uri = f'{self.view_type}://{source[source.find("://")+3:]}'

    def serialize(self):
        return {"name": self.name, "uri": self.uri, "source": self.source}
