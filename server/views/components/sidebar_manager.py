from files.serializable import Serializable
from logger.log_manager import LogsManager
from subjects.subjects_manager import SubjectsManager
from views.groups import IconedViewGroup
from views.views import View


class SideBarManager(Serializable):
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

    def add_activity(self, name: str, icon: str, index=None):
        self.logs_manager.info("[Sidebar] Adding new activity")

        activities = self.activities.value()
        index = index if index else len(activities)
        activities.insert(index, IconedViewGroup(name, icon))
        self.activities.update()
        self.active.notify(activities[index].uri)
        return activities[index].uri

    def add_view(self, view: View, activity_id: str = None):
        activities = self.activities.value()
        activity_id = activity_id if activity_id else self.active.value()[0]
        activity = next(filter(lambda activity: activity.uri == activity_id, activities))

        if activity is None:
            self.logs_manager.error(f"[Sidebar] No activity found for {activity_id}")
            raise KeyError(f"No activity found for {activity_id}")

        self.logs_manager.info(f"[Sidebar] Adding {view.uri}")

        activity.views.insert(0, view)
        activity.active.insert(0, view.uri)
        self.activities.update()
        self.select_view(view.uri, activity.uri)
        return view.uri

    def remove_view(self, view_uri: str, activity_id: str = None):
        activities = self.activities.value()
        activity_id = activity_id if activity_id else self.active.value()[0]
        activity = next(filter(lambda activity: activity.uri == activity_id, activities))

        if activity is None:
            self.logs_manager.error(f"[Sidebar] No activity found for {activity_id}")
            raise KeyError(f"No activity found for {activity_id}")

        elif view_uri not in map(lambda v: v.uri, activity.views) or view_uri not in activity.active:
            self.logs_manager.error(f"[Sidebar] No view found for {view_uri} in activity {activity_id}")
            raise KeyError(f"No view found for {view_uri} in activity {activity_id}")

        self.logs_manager.info(f"[Sidebar] Deleting {view_uri}")

        activity.views = list(filter(lambda v: v.uri != view_uri, activity.views))
        activity.active.remove(view_uri)
        self.activities.update()
        return view_uri

    def select_activity(self, activity_id: str, allow_none=True):
        new_active_activity = activity_id if not allow_none or self.active.value() != activity_id else None

        if new_active_activity is not None and new_active_activity not in map(lambda a: a.uri, self.activities.value()):
            self.logs_manager.error(f"[Sidebar] No activity found for {new_active_activity}")
            raise KeyError(f"No activity found for {new_active_activity}")

        self.logs_manager.info(f"[Sidebar] Setting active activity to {new_active_activity}")

        self.active.notify(new_active_activity)

    def select_view(self, view_uri: str, activity_id: str = None):
        activities = self.activities.value()
        activity_id = activity_id if activity_id else self.active.value()[0]
        activity = next(filter(lambda activity: activity.uri == activity_id, activities))

        if activity is None:
            self.logs_manager.error(f"No activity found for {activity_id}")
            raise KeyError(f"No activity found for {activity_id}")

        elif view_uri not in map(lambda v: v.uri, activity.views):
            self.logs_manager.error(f"No view found for {view_uri} in activity {activity_id}")
            raise KeyError(f"No view found for {view_uri} in activity {activity_id}")

        self.logs_manager.info(f"[Sidebar] Setting active view to {view_uri}")

        activity.active.remove(view_uri)
        activity.active.insert(0, view_uri)
        self.activities.update()
        return view_uri