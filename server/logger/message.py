from datetime import datetime
import string
from serializable import Serializable
from logger.types import LogType


class LogMessage(Serializable):
    def __init__(self, log_type, message):
        self.message: string = message
        self.type: LogType = log_type
        self.time: int = datetime.utcnow().timestamp()

    def serialize(self) -> dict:
        res = {"message": self.message, "type": str(self.type.value), "time": self.time}
        return res

    def __str__(self):
        return f"""["{str(self.type.value).upper()}" - {datetime.fromtimestamp(self.time).strftime('%I:%M:%S %p').lower()}]\t{self.message}"""
