import os
from guide.utils import to_html_hash
from guide.topic import Topic


class Category:
    def __init__(self, path, label):
        self.label = label.split(".", 1)[1]
        self.name = to_html_hash(self.label)
        self.topics = []
        path = os.path.join(path, label)
        for topic in sorted(os.listdir(path)):
            self.topics.append(Topic(path, topic))
