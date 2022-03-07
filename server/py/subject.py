
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

    def update(self):
        if self.is_watched:
            self.subjects_manager.send(self)

    def value(self):
        return self.data
