from . import network_definitions as nd

# TODO: Make abstract, maybe
class Subject:
    def __init__(self, subjects_manager, subject_id, data):
        self.subject_id = subject_id
        self.subjects_manager = subjects_manager
        self.data = data
        self.is_watched = False  # TODO: Semaphore

    def watch(self):
        self.is_watched = True

    def unwatch(self):
        self.is_watched = False

    def notify(self, data):
        self.data = data
        if self.is_watched:
            self.subjects_manager.send(self)

    def get(self):
        return self.data

    def to_dict(self):
        return {nd.SUBJECT_ID_FIELD: self.subject_id, nd.DATA_FIELD: self.data}
