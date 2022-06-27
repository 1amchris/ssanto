from files.serializable import Serializable
from logger.log_manager import LogsManager
from subjects.subjects_manager import SubjectsManager
from views.groups import IconedViewGroup
from views.views import ViewMetadata
from toasts_manager import ToastsManager


class PanelManager(Serializable):
    def __init__(self, subjects: SubjectsManager, logger: LogsManager, toaster: ToastsManager):
        super().__init__()
        self.__subjects = subjects
        self.__logger = logger
        self.__toaster = toaster

        self.__activities = self.__subjects.create("workspace.views.panel.activities", [])
        self.__active = self.__subjects.create("workspace.views.panel.active_view", None)

    def serialize(self):
        return {
            "active": self.__active.value(),
            "activities": [activity.serialize() for activity in self.__activities.value()],
        }

    def add_activity(self, name: str, icon: str, index=None):
        self.__logger.info("[Panel] Adding new activity")

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
            self.__logger.error(f"[Panel] No activity found for {activity_id}")
            raise KeyError(f"No activity found for {activity_id}")

        self.__logger.info(f"[Panel] Adding {view.uri}")

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
            self.__logger.error(f"[Panel] No activity found for {activity_id}")
            raise KeyError(f"No activity found for {activity_id}")

        elif view_uri not in map(lambda v: v.uri, activity.views) or view_uri not in activity.active:
            self.__logger.error(f"[Panel] No view found for {view_uri} in activity {activity_id}")
            raise KeyError(f"No view found for {view_uri} in activity {activity_id}")

        self.__logger.info(f"[Panel] Deleting {view_uri}")

        activity.views = list(filter(lambda v: v.uri != view_uri, activity.views))
        activity.active.remove(view_uri)
        self.__activities.update()
        return view_uri

    def select_activity(self, activity_id: str):
        if activity_id is not None and activity_id not in map(lambda a: a.uri, self.__activities.value()):
            self.__logger.error(f"[Panel] No activity found for {activity_id}")
            raise KeyError(f"No activity found for {activity_id}")

        self.__logger.info(f"[Panel] Setting active activity to {activity_id}")

        self.__active.notify(activity_id)

    def select_view(self, view_uri: str, activity_id: str = None):
        activities = self.__activities.value()
        activity_id = activity_id if activity_id else self.__active.value()[0]
        activity = next(filter(lambda activity: activity.uri == activity_id, activities))

        if activity is None:
            self.__logger.error(f"No activity found for {activity_id}")
            raise KeyError(f"No activity found for {activity_id}")

        elif view_uri not in map(lambda v: v.uri, activity.views):
            self.__logger.error(f"No view found for {view_uri} in activity {activity_id}")
            raise KeyError(f"No view found for {view_uri} in activity {activity_id}")

        self.__logger.info(f"[Panel] Setting active view to {view_uri}")

        activity.active.remove(view_uri)
        activity.active.insert(0, view_uri)
        self.__activities.update()
        return view_uri
