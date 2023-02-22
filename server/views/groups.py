from uuid import uuid4

from serializable import Serializable
from views.controllers.view_controller import ViewController


class ViewGroup(Serializable):
    def __init__(self):
        self.uri = f"view-group://{uuid4()}"
        self.active = []
        self.views: list[ViewController] = []

    def serialize(self):
        active = self.active[0] if len(self.active) > 0 else None
        return {
            "uri": self.uri,
            "active": active,
            "views": []
            if active is None
            else [view.serialize() if active == view.uri else view.metadata() for view in self.views],
        }


class IconedViewGroup(ViewGroup):
    def __init__(self, label, icon):
        super().__init__()
        self.icon = icon
        self.label = label

    def serialize(self):
        res = super().serialize()
        res.update({"label": self.label, "icon": self.icon})
        return res
