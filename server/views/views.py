from files.serializable import Serializable


class View(Serializable):
    def __init__(self, name, source):
        self.name = name
        self.source = source
        self.view_type = self.get_view_type()
        self.uri = f'{self.view_type}://{source[source.find("://")+3:]}'

    def serialize(self):
        return {"name": self.name, "uri": self.uri, "source": self.source}

    def get_view_type(self):
        # TODO: determine view type based on the source's extension
        return "view"
