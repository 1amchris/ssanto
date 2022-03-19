from re import sub
from .subject import Subject
from .network_definitions import Field, SendType


class SubjectsManager:
    def __init__(self, server_socket):
        self.subjects = {}
        self.server_socket = server_socket

    def create(self, name, data=None):
        self.subjects[name] = Subject(self, name, data)
        return self.subjects[name]

    def destroy(self):
        raise NotImplementedError("Not implemented yet!")

    def send(self, s):
        self.server_socket.send(SendType.SUBJECT.value, {
            Field.SUBJECT_ID.value: s.subject_id,
            Field.DATA.value: s.value()
        })

    def subscribe(self, subject):
        # TODO: Handle sid unavailable
        subject = self.subjects[subject]
        subject.watch()
        self.send(subject)

    def unsubscribe(self, subject):
        # TODO: Handle sid unavailable
        subject = self.subjects[subject]
        subject.unwatch()

    def update(self, subject, data):
        self.subjects[subject].notify(data)
        # notify ???
