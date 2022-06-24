from uuid import uuid4

from files.serializable import Serializable
from views.controllers.view_controller import ViewController


class ViewGroup(Serializable):
    def __init__(self):
        self.uri = f"view-group://{uuid4()}"
        self.active = []
        self.views: list[ViewController] = []

    def serialize(self):
        return {"uri": self.uri, "active": self.active, "views": [view.serialize() for view in self.views]}


class IconedViewGroup(ViewGroup):
    def __init__(self, label, icon):
        super().__init__()
        self.icon = icon
        self.label = label

    def serialize(self):
        res = super().serialize()
        res.update({"label": self.label, "icon": self.icon})
        return res
