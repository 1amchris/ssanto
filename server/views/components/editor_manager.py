from files.serializable import Serializable
from logger.log_manager import LogsManager
from subjects.subjects_manager import SubjectsManager
from views.views import View
from views.groups import ViewGroup


class EditorManager(Serializable):
    def __init__(self, subjects_manager: SubjectsManager, logs_manager: LogsManager):
        super().__init__()
        self.subjects_manager = subjects_manager
        self.logs_manager = logs_manager

        initial_group = ViewGroup()
        self.groups = self.subjects_manager.create("views_manager.editor.views", [initial_group])
        self.active = self.subjects_manager.create("views_manager.editor.active_views", [initial_group.uri])

    def serialize(self):
        return {
            "active": self.active.value(),
            "groups": [group.serialize() for group in self.groups.value()],
        }

    def add_group(self, index=None):
        self.logs_manager.info("[Editor] Adding new group")

        groups = self.groups.value()
        index = index if index else len(groups)
        groups.insert(index, ViewGroup())
        self.active.value().insert(0, groups[index].uri)
        self.active.update()
        self.groups.update()
        return groups[index].uri

    def add_view(self, view: View, group_id: str = None, prevent_duplicates=True):
        groups = self.groups.value()

        if prevent_duplicates:
            for group_uri in self.active.value():
                group = next(filter(lambda group: group.uri == group_uri, groups))
                if view.uri in map(lambda v: v.uri, group.views):
                    self.select_view(view.uri, group_uri)
                    return view.uri

        self.logs_manager.info(f"[Editor] Adding {view.uri}")

        group_id = group_id if group_id else self.active.value()[0]
        group = next(filter(lambda group: group.uri == group_id, groups))

        if group is None:
            self.logs_manager.error(f"[Editor] No editor group found for {group_id}")
            raise KeyError(f"No editor group found for {group_id}")

        else:
            group.views.insert(0, view)
            group.active.insert(0, view.uri)
            self.groups.update()
            self.select_view(view.uri, group.uri)
            return view.uri

    def remove_view(self, view_uri: str, group_id: str = None):
        groups = self.groups.value()
        group_id = group_id if group_id else self.active.value()[0]
        group = next(filter(lambda group: group.uri == group_id, groups))

        if group is None:
            self.logs_manager.error(f"[Editor] No editor group found for {group_id}")
            raise KeyError(f"No editor group found for {group_id}")

        elif view_uri not in map(lambda v: v.uri, group.views) or view_uri not in group.active:
            self.logs_manager.error(f"[Editor] No view found for {view_uri} in editor group {group_id}")
            raise KeyError(f"No view found for {view_uri} in editor group {group_id}")

        self.logs_manager.info(f"[Editor] Deleting {view_uri}")

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

        self.groups.notify(groups)
        self.active.notify(active)
        return view_uri

    def select_group(self, group_id: str):
        if next(filter(lambda group: group.uri == group_id, self.groups.value())) is None:
            self.logs_manager.error(f"[Editor] No editor group found for {group_id}")
            raise KeyError(f"No editor group found for {group_id}")

        self.logs_manager.info(f"[Editor] Setting active editor group to {group_id}")

        self.active.value().remove(group_id)
        self.active.value().insert(0, group_id)
        self.active.update()
        return group_id

    def select_view(self, view_uri: str, group_id: str = None):
        groups = self.groups.value()
        group_id = group_id if group_id else self.active.value()[0]
        group = next(filter(lambda group: group.uri == group_id, groups))

        if group is None:
            self.logs_manager.error(f"[Editor] No editor group found for {group_id}")
            raise KeyError(f"No editor group found for {group_id}")

        elif view_uri not in map(lambda v: v.uri, group.views):
            self.logs_manager.error(f"No view found for {view_uri} in editor group {group_id}")
            raise KeyError(f"No view found for {view_uri} in editor group {group_id}")

        self.logs_manager.info(f"[Editor] Setting active view to {view_uri} for editor group {group_id}")

        group.active.remove(view_uri)
        group.active.insert(0, view_uri)
        self.groups.update()
        self.active.value().remove(group_id)
        self.active.value().insert(0, group_id)
        self.active.update()
        return view_uri
