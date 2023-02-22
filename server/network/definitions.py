from enum import Enum

# PACKAGE FIELDS


class Field(Enum):
    CALL_ID = "call"
    SUBJECT_ID = "subject"
    TARGET = "target"
    DATA = "data"


class SendType(Enum):
    SUBJECT = 0
    CALL = 1
    ERROR = -1
