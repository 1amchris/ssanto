from collections import defaultdict
import string
from files.serializable import Serializable
from logger.log_message import LogMessage
from logger.log_types import LogType
from subjects.subjects_manager import SubjectsManager


class Logs(Serializable):
    def __init__(self):
        self.logs = defaultdict(list)

    def __getitem__(self, log_type):
        return self.logs[log_type]

    def __setitem__(self, log_type, log_messages):
        self.logs[log_type] = log_messages

    def serialize(self):
        res = {str(log_type.value): [log.serialize() for log in logs] for log_type, logs in self.logs.items()}
        return res

    def clear(self):
        self.logs = defaultdict(list)


class LogsManager(Serializable):
    def __init__(self, subjects_manager: SubjectsManager):
        super().__init__()
        self.subjects_manager = subjects_manager
        self.logs = self.subjects_manager.create("logs_manager.logs", Logs())

        # Probably shouldn't be in the logs manager itself, and should be in some parent logger class
        self.info("Starting up...")
        self.info("Logs manager initialized.")

    def serialize(self) -> dict:
        return self.logs.value().serialize()

    def add_log(self, log_type: LogType, message: string):
        # TODO: it might become heavy over time (sends all of the logs all of the time).
        # We should address this if it becomes a problem
        self.logs.value()[log_type].append(LogMessage(log_type, message))
        self.logs.update()

    def get_logs(self, log_type=None, start=None, end=None) -> list:
        if log_type is None:
            return {key: logs[start:end] for key, logs in self.logs.value().items()}
        elif log_type in self.logs.value():
            return self.logs.value()[log_type][start:end]
        else:
            raise KeyError(f"No logs for {log_type}")

    def tip(self, message: string):
        self.add_log(LogType.TIP, message)

    def warning(self, message: string):
        self.add_log(LogType.WARNING, message)

    def error(self, message: string):
        self.add_log(LogType.ERROR, message)

    def info(self, message: string):
        self.add_log(LogType.INFO, message)

    def debug(self, message: string):
        self.add_log(LogType.DEBUG, message)

    def critical(self, message: string):
        self.add_log(LogType.CRITICAL, message)
