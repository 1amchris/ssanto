from network.server_socket import ServerSocket
from singleton import TenantInstance, TenantSingleton
from .subject import Subject
from network.network_definitions import Field, SendType


class SubjectsManager(TenantInstance, metaclass=TenantSingleton):
    def __init__(self, tenant_id):
        super().__init__(tenant_id)
        self.__subjects = {}
        self.__missing_subjects = set()
        self.__server_socket = ServerSocket(tenant_id)

    def create(self, name, data=None):
        subject = Subject(self, name, data)
        self.__subjects[name] = subject

        if name in self.__missing_subjects:
            self.__missing_subjects.remove(name)
            self.subscribe(name)

        return subject

    def destroy(self):
        raise NotImplementedError("Not implemented yet!")

    def send(self, s):
        self.__server_socket.send(
            SendType.SUBJECT.value, {Field.SUBJECT_ID.value: s.subject_id, Field.DATA.value: s.value()}
        )

    def subscribe(self, subject):
        # TODO: Handle sid unavailable
        if subject in self.__subjects:
            subject = self.__subjects[subject]
            subject.watch()
            self.send(subject)
        else:
            self.__missing_subjects.add(subject)
            print("subject not found", subject)

    def unsubscribe(self, subject):
        # TODO: Handle sid unavailable
        if subject in self.__subjects:
            subject = self.__subjects[subject]
            subject.unwatch()
        if subject in self.__missing_subjects:
            self.__missing_subjects.remove(subject)

    def update(self, subject, data):
        self.__subjects[subject].notify(data)
