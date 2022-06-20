from files.serializable import Serializable
from logger.log_manager import LogsManager
from subjects.subjects_manager import SubjectsManager
from views.views import ViewMetadata
from views.groups import ViewGroup


class EditorManager(Serializable):
    def __init__(self, subjects_manager: SubjectsManager, logs_manager: LogsManager):
        super().__init__()
        self.subjects_manager = subjects_manager
        self.logs_manager = logs_manager

        initial_group = ViewGroup()
        self.groups = self.subjects_manager.create("workspace.views.editor.views", [initial_group])
        self.active = self.subjects_manager.create("workspace.views.editor.active_views", [initial_group.uri])
        self.active_views_data = self.subjects_manager.create("workspace.views.editor.active_views_data", [])

    def serialize(self):
        return {
            "active_views_data": self.active_views_data.value(),
            "active": self.active.value(),
            "groups": [group.serialize() for group in self.groups.value()],
        }

    def add_group(self, index=None):
        self.logs_manager.info("[Editor] Adding new group")

        index = index if index else len(self.groups.value())
        group = ViewGroup()
        self.groups.value().insert(index, group)
        self.active.value().insert(0, group.uri)
        self.active.update()
        self.groups.update()
        return self.select_group(group.uri)

    def remove_group(self, group_id: str):
        groups = self.groups.value()
        group = next(filter(lambda group: group.uri == group_id, groups), None)

        if group is None:
            self.logs_manager.error(f"[Editor] No editor group found for {group_id}")
            raise KeyError(f"No editor group found for {group_id}")

        elif len(group.views) > 0:
            self.logs_manager.error(
                f"[Editor] Found views in editor group {group_id}. Cannot close editor group containing views."
            )
            raise KeyError(f"Found views in editor group {group_id}. Cannot close editor group containing views.")

        self.logs_manager.info(f"[Editor] Deleting editor group {group_id}")

        self.active.notify(list(filter(lambda g: g != group_id, self.active.value())))
        self.groups.notify(list(filter(lambda g: g.uri != group_id, groups)))
        return self.select_group(self.active.value()[0])

    def add_view(self, view: ViewMetadata, group_id: str = None, prevent_duplicates=True):
        groups = self.groups.value()

        if prevent_duplicates:
            for group_uri in self.active.value():
                group = next(filter(lambda group: group.uri == group_uri, groups))
                existing_view = next(
                    filter(lambda v: (v.source, v.view_type) == (view.source, view.view_type), group.views), None
                )
                if existing_view is not None:
                    return self.select_view(existing_view.uri, group_uri)

        self.logs_manager.info(f"[Editor] Adding {view.uri}")

        group_id = group_id if group_id else self.active.value()[0]
        group = next(filter(lambda group: group.uri == group_id, groups), None)

        if group is None:
            self.logs_manager.error(f"[Editor] No editor group found for {group_id}")
            raise KeyError(f"No editor group found for {group_id}")

        else:
            group.views.insert(0, view)
            group.active.insert(0, view.uri)
            self.groups.update()
            return self.select_view(view.uri, group.uri)

    def remove_view(self, view_uri: str, group_id: str = None):
        groups = self.groups.value()
        group_id = group_id if group_id else self.active.value()[0]
        group = next(filter(lambda group: group.uri == group_id, groups), None)

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
        if next(filter(lambda group: group.uri == group_id, self.groups.value()), None) is None:
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
        group = next(filter(lambda group: group.uri == group_id, groups), None)

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
