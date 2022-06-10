import string
from uuid import uuid4
from files.serializable import Serializable
from subjects.subjects_manager import SubjectsManager
from logger.log_manager import LogsManager


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


class FileExplorerView(View):
    def __init__(self, root: string):
        super().__init__("explorer", root)

    def get_view_type(self):
        return "file-explorer"


class FileSearcherView(View):
    def __init__(self, root: string):
        super().__init__("search", root)

    def get_view_type(self):
        return "file-searcher"


class ViewGroup(Serializable):
    def __init__(self):
        self.uri = f"view-group://{uuid4()}"
        self.active = []
        self.views = []

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


class Editor(Serializable):
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

    def add_view(self, view: View, group_id: string = None):
        self.logs_manager.info(f"[Editor] Adding {view.uri}")

        groups = self.groups.value()
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

    def remove_view(self, view_uri: string, group_id: string = None):
        self.logs_manager.info(f"[Editor] Deleting {view_uri}")

        groups = self.groups.value()
        group_id = group_id if group_id else self.active.value()[0]
        group = next(filter(lambda group: group.uri == group_id, groups))

        if group is None:
            self.logs_manager.error(f"[Editor] No editor group found for {group_id}")
            raise KeyError(f"No editor group found for {group_id}")

        elif view_uri not in map(lambda v: v.uri, group.views) or view_uri not in group.active:
            self.logs_manager.error(f"[Editor] No view found for {view_uri} in editor group {group_id}")
            raise KeyError(f"No view found for {view_uri} in editor group {group_id}")

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
        self.logs_manager.info(f"[Editor] Setting active view to {view_uri}")

        groups = self.groups.value()
        group_id = group_id if group_id else self.active.value()[0]
        group = next(filter(lambda group: group.uri == group_id, groups))

        if group is None:
            self.logs_manager.error(f"[Editor] No editor group found for {group_id}")
            raise KeyError(f"No editor group found for {group_id}")

        elif view_uri not in map(lambda v: v.uri, group.views):
            self.logs_manager.error(f"No view found for {view_uri} in editor group {group_id}")
            raise KeyError(f"No view found for {view_uri} in editor group {group_id}")

        else:
            group.active.remove(view_uri)
            group.active.insert(0, view_uri)
            self.groups.update()
            return view_uri


class SideBar(Serializable):
    def __init__(self, subjects_manager: SubjectsManager, logs_manager: LogsManager):
        super().__init__()
        self.subjects_manager = subjects_manager
        self.logs_manager = logs_manager

        self.activities = self.subjects_manager.create("views_manager.sidebar.activities", [])
        self.active = self.subjects_manager.create("views_manager.sidebar.active_view", None)

    def serialize(self):
        return {
            "active": self.active.value(),
            "activities": [activity.serialize() for activity in self.activities.value()],
        }

    def add_activity(self, name: string, icon: string, index=None):
        self.logs_manager.info("[Sidebar] Adding new activity")

        activities = self.activities.value()
        index = index if index else len(activities)
        activities.insert(index, IconedViewGroup(name, icon))
        self.activities.update()
        self.active.notify(activities[index].uri)
        return activities[index].uri

    def add_view(self, view: View, activity_id: string = None):
        self.logs_manager.info(f"[Sidebar] Adding {view.uri}")

        activities = self.activities.value()
        activity_id = activity_id if activity_id else self.active.value()[0]
        activity = next(filter(lambda activity: activity.uri == activity_id, activities))

        if activity is None:
            self.logs_manager.error(f"[Sidebar] No activity found for {activity_id}")
            raise KeyError(f"No activity found for {activity_id}")

        else:
            activity.views.insert(0, view)
            activity.active.insert(0, view.uri)
            self.activities.update()
            self.select_view(view.uri, activity.uri)
            return view.uri

    def remove_view(self, view_uri: string, activity_id: string = None):
        self.logs_manager.info(f"[Sidebar] Deleting {view_uri}")

        activities = self.activities.value()
        activity_id = activity_id if activity_id else self.active.value()[0]
        activity = next(filter(lambda activity: activity.uri == activity_id, activities))

        if activity is None:
            self.logs_manager.error(f"[Sidebar] No activity found for {activity_id}")
            raise KeyError(f"No activity found for {activity_id}")

        elif view_uri not in map(lambda v: v.uri, activity.views) or view_uri not in activity.active:
            self.logs_manager.error(f"[Sidebar] No view found for {view_uri} in activity {activity_id}")
            raise KeyError(f"No view found for {view_uri} in activity {activity_id}")

        else:
            activity.views = list(filter(lambda v: v.uri != view_uri, activity.views))
            activity.active.remove(view_uri)
            self.activities.update()
            return view_uri

    def select_activity(self, activity_id: string):
        new_active_activity = activity_id if self.active.value() != activity_id else None
        self.logs_manager.info(f"[Sidebar] Setting active activity to {new_active_activity}")

        if new_active_activity is not None and new_active_activity not in map(lambda a: a.uri, self.activities.value()):
            self.logs_manager.error(f"[Sidebar] No activity found for {new_active_activity}")
            raise KeyError(f"No activity found for {new_active_activity}")

        self.active.notify(new_active_activity)

    def select_view(self, view_uri: string, activity_id: string = None):
        self.logs_manager.info(f"[Sidebar] Setting active view to {view_uri}")

        activities = self.activities.value()
        activity_id = activity_id if activity_id else self.active.value()[0]
        activity = next(filter(lambda activity: activity.uri == activity_id, activities))

        if activity is None:
            self.logs_manager.error(f"No activity found for {activity_id}")
            raise KeyError(f"No activity found for {activity_id}")

        elif view_uri not in map(lambda v: v.uri, activity.views):
            self.logs_manager.error(f"No view found for {view_uri} in activity {activity_id}")
            raise KeyError(f"No view found for {view_uri} in activity {activity_id}")

        else:
            activity.active.remove(view_uri)
            activity.active.insert(0, view_uri)
            self.activities.update()
            return view_uri


class ViewsManager(Serializable):
    def __init__(self, subjects_manager: SubjectsManager, logs_manager: LogsManager):
        super().__init__()
        self.subjects_manager = subjects_manager
        self.logs_manager = logs_manager
        self.sidebar = SideBar(subjects_manager, logs_manager)
        self.editor = Editor(subjects_manager, logs_manager)

        self.logs_manager.info("ViewManager initialized.")

    def serialize(self) -> dict:
        return {
            "editor": self.editor.serialize(),
            "sidebar": self.sidebar.serialize(),
        }
