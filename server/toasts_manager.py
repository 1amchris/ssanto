import asyncio
from enum import Enum
from typing import Callable
from uuid import uuid4
from files.serializable import Serializable
from logger.log_manager import LogsManager
from subjects.subjects_manager import SubjectsManager


class ToastAction(Serializable):
    def __init__(self, label, action: Callable):
        self.id = uuid4()
        self.label = label
        self.action = action

    def serialize(self):
        return {
            "id": str(self.id),
            "label": self.label,
        }

    def __call__(self, *args, **kwargs):
        self.action(*args, **kwargs)


class ToastSeverity(Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"


class Toast(Serializable):
    def __init__(
        self,
        message: str,
        severity: ToastSeverity,
        actions: list[ToastAction] = None,
        closeable: bool = True,
        source: str = None,
        duration: float = 3,
        close_callback: Callable = None,
    ):
        self.id = uuid4()
        self.message = message
        self.severity = severity
        self.actions = [] if actions is None else actions
        self.closeable = closeable
        self.source = source

        if close_callback is not None and duration is not None and duration > 0:
            asyncio.get_running_loop().call_later(duration, close_callback)

    def serialize(self) -> dict:
        return {
            "id": str(self.id),
            "message": self.message,
            "severity": self.severity.value,
            "actions": [action.serialize() for action in self.actions],
            "closeable": self.closeable,
            "source": self.source,
        }

    def __str__(self):
        return self.message

    def __repr__(self):
        return self.message

    def __eq__(self, other):
        return self.message == other.message and self.duration == other.duration

    def __hash__(self):
        return hash(self.message) + hash(self.duration)


class ToastsManager:
    def __init__(self, subjects: SubjectsManager, logger: LogsManager):
        self.__subjects = subjects
        self.__logger = logger
        self.__toasts = self.__subjects.create("toaster.toasts", [])

        self.__logger.info("ToastsManager initialized.")

    def add_toast(
        self,
        message: str,
        severity: ToastSeverity,
        duration: float = 3,
        actions: list[ToastAction] = None,
        source: str = None,
        closeable: bool = True,
    ):
        toast = Toast(
            message=message,
            severity=severity,
            duration=duration,
            actions=actions,
            source=source,
            closeable=closeable,
            close_callback=lambda: self.remove_toast(toast),
        )
        self.__toasts.value().append(toast)
        self.__toasts.update()

        self.__logger.info(f"[Toast Manager] Created toast with id {toast.id}")

    def remove_toast(self, toast):
        # TODO: Perhaps we should validate that the toast exists
        self.__toasts.value().remove(toast)
        self.__toasts.update()

        self.__logger.info(f"[Toast Manager] Removed toast with id {toast.id}")

    def get_toasts(self):
        return self.__toasts.value()

    def get_toast(self, id):
        return next(filter(lambda t: str(t.id) == id, self.__toasts.value()), None)

    def close_toast(self, toastId):
        toast = self.get_toast(toastId)
        if toast is None:
            self.__logger.error(f"[Toast Manager] Toast not found {toastId}")
            raise KeyError(f"Toast not found: {toastId}")

        self.remove_toast(toast)

    def trigger_action(self, toastId, actionId):

        toast = self.get_toast(toastId)

        if toast is None:
            self.__logger.error(f"[Toast Manager] Toast not found {toastId}")
            raise KeyError(f"Toast not found {toastId}")

        action = next(filter(lambda a: str(a.id) == actionId, toast.actions), None)
        if action is None:
            self.__logger.error(f"[Toast Manager] Action not found {actionId}")
            raise KeyError(f"Action not found {actionId}")

        action(toastId, actionId)
        self.__logger.info(f"[Toast Manager] Action triggered {actionId} for toast {toastId}")
        self.remove_toast(toast)

    # shortcut for convenience
    def info(self, *args, **kwargs):
        self.add_toast(*args, **kwargs, severity=ToastSeverity.INFO)

    def warn(self, *args, **kwargs):
        self.add_toast(*args, **kwargs, severity=ToastSeverity.WARNING)

    def error(self, *args, **kwargs):
        self.add_toast(*args, **kwargs, severity=ToastSeverity.ERROR)
