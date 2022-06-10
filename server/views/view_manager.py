import string
from uuid import uuid4
from files.serializable import Serializable
from subjects.subjects_manager import SubjectsManager
from logger.log_manager import LogsManager


class View(Serializable):
    def __init__(self, name, source: string):
        self.name = name
        self.source = source

        # TODO: determine view type based on the source's extension
        self.view_type = "view"
        self.uri = f'{self.view_type}://{source[source.find("://")+3:]}'

    def serialize(self):
        return {"name": self.name, "source": self.source, "uri": self.uri}


class ViewGroup(Serializable):
    def __init__(self):
        self.uri = f"view-group://{uuid4()}"
        self.active = []
        self.views = []

    def serialize(self):
        return {"uri": self.uri, "active": self.active, "views": [view.serialize() for view in self.views]}


class ViewsManager(Serializable):
    def __init__(self, subjects_manager: SubjectsManager, logs_manager: LogsManager):
        super().__init__()
        self.subjects_manager = subjects_manager
        self.logs_manager = logs_manager

        initial_group = ViewGroup()
        self.groups = self.subjects_manager.create("views_manager.views", [initial_group])
        self.active = self.subjects_manager.create("views_manager.active_views", [initial_group.uri])

        self.logs_manager.info("ViewManager initialized.")

    def serialize(self) -> dict:
        return {"active": self.active.value(), "groups": [group.serialize() for group in self.groups.value()]}

    def add_group(self, index=None):
        self.logs_manager.info("Adding new group")

        groups = self.groups.value()
        index = index if index else len(groups)
        groups.insert(index, ViewGroup())
        self.active.value().insert(0, groups[index].uri)
        self.active.update()
        self.groups.update()
        return groups[index].uri

    def add_view(self, view: View, group_id: string = None):
        self.logs_manager.info(f"Adding {view.uri}")

        groups = self.groups.value()
        group_id = group_id if group_id else self.active.value()[0]
        group = next(filter(lambda group: group.uri == group_id, groups))

        if group is None:
            self.logs_manager.warning(f"No group found for {group_id}")
            raise KeyError(f"No group found for {group_id}")

        else:
            group.views.insert(0, view)
            group.active.insert(0, view.uri)
            self.groups.update()
            self.select_view(view.uri, group.uri)
            return view.uri

    def remove_view(self, view_uri: string, group_id: string = None):
        self.logs_manager.info(f"Deleting {view_uri}")

        groups = self.groups.value()
        group_id = group_id if group_id else self.active.value()[0]
        group = next(filter(lambda group: group.uri == group_id, groups))

        if group is None:
            self.logs_manager.warning(f"No group found for {group_id}")
            raise KeyError(f"No group found for {group_id}")

        elif view_uri not in map(lambda v: v.uri, group.views) or view_uri not in group.active:
            self.logs_manager.warning(f"No view found for {view_uri} in group {group_id}")
            raise KeyError(f"No view found for {view_uri} in group {group_id}")

        else:
            group.views = list(filter(lambda v: v.uri != view_uri, group.views))
            group.active.remove(view_uri)
            active = self.active.value()

            if len(group.views) == 0:
                groups = list(filter(lambda g: g.uri != group.uri, groups))
                active.remove(group.uri)

            if len(groups) == 0:
                new_group = ViewGroup()
                groups.insert(0, new_group)
                active.insert(0, new_group.uri)

            self.groups.update()
            self.active.update()
            return view_uri

    def select_view(self, view_uri: string, group_id: string = None):
        self.logs_manager.info(f"Setting active view for {view_uri}")

        groups = self.groups.value()
        group_id = group_id if group_id else self.active.value()[0]
        group = next(filter(lambda group: group.uri == group_id, groups))

        if group is None:
            self.logs_manager.warning(f"No group found for {group_id}")
            raise KeyError(f"No group found for {group_id}")

        elif view_uri not in map(lambda v: v.uri, group.views):
            self.logs_manager.warning(f"No view found for {view_uri} in group {group_id}")
            raise KeyError(f"No view found for {view_uri} in group {group_id}")

        else:
            group.active.remove(view_uri)
            group.active.insert(0, view_uri)
            self.groups.update()
            return view_uri
