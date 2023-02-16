from collections import defaultdict
from logger.logger import Logger
from singleton import TenantInstance, TenantSingleton
from serializable import Serializable
from logger.message import LogMessage
from logger.types import LogType
from subjects.manager import SubjectsManager


class Logs(Serializable):
    def __init__(self):
        self.logs = defaultdict(list)

    def __getitem__(self, log_type):
        return self.logs[log_type]

    def __setitem__(self, log_type, log_messages):
        self.logs[log_type] = log_messages

    def serialize(self):
        return {str(log_type.value): [log.serialize() for log in logs] for log_type, logs in self.logs.items()}

    def clear(self):
        self.logs = defaultdict(list)


class LogsManager(TenantInstance, Serializable, metaclass=TenantSingleton):
    def __init__(self, tenant_id: str):
        super().__init__(tenant_id)
        self.subjects = SubjectsManager(tenant_id)
        self.logs = self.subjects.create("logger.logs", Logs())

        # Probably shouldn't be in the logs manager itself, and should be in some parent logger class
        self.info("[Logs] initialized.")

    def serialize(self) -> dict:
        return self.logs.value().serialize()

    def add_log(self, log_type: LogType, message: str):
        # TODO: it might become heavy over time (sends all of the logs all of the time).
        # We should address this when it becomes a problem
        log = LogMessage(log_type, message)
        self.logs.value()[log_type].append(log)
        self.logs.update()
        print(log)

    def get_logs(self, log_type=None, start=None, end=None) -> list:
        if log_type is None:
            return {key: logs[start:end] for key, logs in self.logs.value().items()}
        elif log_type in self.logs.value():
            return self.logs.value()[log_type][start:end]
        else:
            raise KeyError(f"No logs for {log_type}")

    def tip(self, message: str):
        self.add_log(LogType.TIP, message)

    def warning(self, message: str):
        self.add_log(LogType.WARNING, message)

    def error(self, message: str):
        self.add_log(LogType.ERROR, message)

    def info(self, message: str):
        self.add_log(LogType.INFO, message)

    def debug(self, message: str):
        self.add_log(LogType.DEBUG, message)

    def critical(self, message: str):
        self.add_log(LogType.CRITICAL, message)
