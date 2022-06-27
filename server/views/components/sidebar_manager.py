from files.serializable import Serializable
from logger.log_manager import LogsManager
from subjects.subjects_manager import SubjectsManager
from views.groups import IconedViewGroup
from views.views import ViewMetadata
from toasts_manager import ToastsManager


class SideBarManager(Serializable):
    def __init__(self, subjects: SubjectsManager, logger: LogsManager, toaster: ToastsManager):
        super().__init__()
        self.__subjects = subjects
        self.__loggers = logger
        self.__toaster = toaster

        self.__activities = self.__subjects.create("workspace.views.sidebar.activities", [])
        self.__active = self.__subjects.create("workspace.views.sidebar.active_view", None)

    def serialize(self):
        return {
            "active": self.__active.value(),
            "activities": [activity.serialize() for activity in self.__activities.value()],
        }

    def add_activity(self, name: str, icon: str, index=None):
        self.__loggers.info("[Sidebar] Adding new activity")

        activities = self.__activities.value()
        index = index if index else len(activities)
        activities.insert(index, IconedViewGroup(name, icon))
        self.__activities.update()
        self.__active.notify(activities[index].uri)
        return activities[index].uri

    def add_view(self, view: ViewMetadata, activity_id: str = None):
        activities = self.__activities.value()
        activity_id = activity_id if activity_id else self.__active.value()[0]
        activity = next(filter(lambda activity: activity.uri == activity_id, activities))

        if activity is None:
            self.__loggers.error(f"[Sidebar] No activity found for {activity_id}")
            raise KeyError(f"No activity found for {activity_id}")

        self.__loggers.info(f"[Sidebar] Adding {view.uri}")

        activity.views.insert(0, view)
        activity.active.insert(0, view.uri)
        self.__activities.update()
        self.select_view(view.uri, activity.uri)
        return view.uri

    def remove_view(self, view_uri: str, activity_id: str = None):
        activities = self.__activities.value()
        activity_id = activity_id if activity_id else self.__active.value()[0]
        activity = next(filter(lambda activity: activity.uri == activity_id, activities))

        if activity is None:
            self.__loggers.error(f"[Sidebar] No activity found for {activity_id}")
            raise KeyError(f"No activity found for {activity_id}")

        elif view_uri not in map(lambda v: v.uri, activity.views) or view_uri not in activity.active:
            self.__loggers.error(f"[Sidebar] No view found for {view_uri} in activity {activity_id}")
            raise KeyError(f"No view found for {view_uri} in activity {activity_id}")

        self.__loggers.info(f"[Sidebar] Deleting {view_uri}")

        activity.views = list(filter(lambda v: v.uri != view_uri, activity.views))
        activity.active.remove(view_uri)
        self.__activities.update()
        return view_uri

    def select_activity(self, activity_id: str, allow_none=True):
        new_active_activity = activity_id if not allow_none or self.__active.value() != activity_id else None

        if new_active_activity is not None and new_active_activity not in map(
            lambda a: a.uri, self.__activities.value()
        ):
            self.__loggers.error(f"[Sidebar] No activity found for {new_active_activity}")
            raise KeyError(f"No activity found for {new_active_activity}")

        self.__loggers.info(f"[Sidebar] Setting active activity to {new_active_activity}")

        self.__active.notify(new_active_activity)

    def select_view(self, view_uri: str, activity_id: str = None):
        activities = self.__activities.value()
        activity_id = activity_id if activity_id else self.__active.value()[0]
        activity = next(filter(lambda activity: activity.uri == activity_id, activities))

        if activity is None:
            self.__loggers.error(f"No activity found for {activity_id}")
            raise KeyError(f"No activity found for {activity_id}")

        elif view_uri not in map(lambda v: v.uri, activity.views):
            self.__loggers.error(f"No view found for {view_uri} in activity {activity_id}")
            raise KeyError(f"No view found for {view_uri} in activity {activity_id}")

        self.__loggers.info(f"[Sidebar] Setting active view to {view_uri}")

        activity.active.remove(view_uri)
        activity.active.insert(0, view_uri)
        self.__activities.update()
        return view_uri
