import asyncio
from enum import Enum
from typing import Callable
from uuid import uuid4
from serializable import Serializable
from logger.manager import LogsManager
from singleton import TenantInstance, TenantSingleton
from subjects.manager import SubjectsManager


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
        if self.action is not None:
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


class ToastsManager(TenantInstance, metaclass=TenantSingleton):
    def __init__(self, tenant_id: str):
        super().__init__(tenant_id)
        self.__subjects = SubjectsManager(tenant_id)
        self.__logger = LogsManager(tenant_id)
        self.__toasts = self.__subjects.create("toaster.toasts", [])

        self.__logger.info("[Toast Manager] initialized.")

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
            close_callback=lambda: self.remove_toast(toast, fail_quietly=True),
        )
        self.__toasts.value().append(toast)
        self.__toasts.update()

        self.__logger.info(f"[Toast Manager] Created toast with id {toast.id}")

    def remove_toast(self, toast: Toast, fail_quietly=False):
        try:
            self.__toasts.value().remove(toast)
            self.__toasts.update()
            self.__logger.info(f"[Toast Manager] Removed toast with id {toast.id}")
        except ValueError as e:
            if not fail_quietly:
                self.__logger.error(f"[Toast Manager] Toast not found {toast.id}")
                raise e from None

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
        self.remove_toast(toast, fail_quietly=True)

    def clear_toasts(self):
        for toast in self.__toasts.value():
            self.remove_toast(toast)

    # shortcuts (convenient)
    def info(self, *args, **kwargs):
        kwargs["severity"] = ToastSeverity.INFO
        kwargs["duration"] = kwargs["duration"] if "duration" in kwargs else 5
        self.add_toast(*args, **kwargs)

    def warn(self, *args, **kwargs):
        kwargs["severity"] = ToastSeverity.WARNING
        kwargs["duration"] = kwargs["duration"] if "duration" in kwargs else 10
        self.add_toast(*args, **kwargs)

    def error(self, *args, **kwargs):
        kwargs["severity"] = ToastSeverity.ERROR
        kwargs["duration"] = kwargs["duration"] if "duration" in kwargs else None
        self.add_toast(*args, **kwargs)
