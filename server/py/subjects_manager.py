from .subject import Subject
from . import network_definitions as nd


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
        self.server_socket.send(s)

    def subscribe(self, command):
        # TODO: Handle sid unavailable
        subject = self.subjects[command[nd.SUBJECT_ID_FIELD]]
        subject.watch()
        self.send(subject)

    def unsubscribe(self, command):
        # TODO: Handle sid unavailable
        subject = self.subjects[command[nd.SUBJECT_ID_FIELD]]
        subject.unwatch()
