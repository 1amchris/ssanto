import os
from guide.utils import to_html_hash


class Topic:
    def __init__(self, path, label):
        stem = os.path.splitext(label)[0]
        self.label = stem.split(".", 1)[1]
        self.name = to_html_hash(self.label)
        path = os.path.join(path, label)
        with open(path) as t:
            self.content = t.read()
