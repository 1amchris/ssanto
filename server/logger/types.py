from enum import Enum


class LogType(Enum):
    DEBUG = "debug"
    TIP = "tip"
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"
    SUCCESS = "success"
