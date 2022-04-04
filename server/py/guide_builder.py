import os


class Topic:
    def __init__(self, path, label):
        stem = os.path.splitext(label)[0]
        self.label = stem.split(".", 1)[1]
        self.name = GuideBuilder.to_html_hash(self.label)
        path = os.path.join(path, label)
        with open(path) as t:
            self.content = t.read()


class Category:
    def __init__(self, path, label):
        self.label = label.split(".", 1)[1]
        self.name = GuideBuilder.to_html_hash(self.label)
        self.topics = []
        path = os.path.join(path, label)
        for topic in sorted(os.listdir(path)):
            self.topics.append(Topic(path, topic))


class GuideBuilder:
    topic_counter = 0
    category_counter = 0

    def __init__(self):
        self.categories = []
        path = os.path.join(os.getcwd(), "guide")
        if not os.path.exists(path):
            print("Path '{}' doesn't exit. The guide will be empty.".format(path))
            return

        for category in sorted(os.listdir(path)):
            self.categories.append(Category(path, category))

    @staticmethod
    def next_topic_id():
        id = GuideBuilder.topic_counter
        GuideBuilder.topic_counter += 1
        return id

    @staticmethod
    def next_category_id():
        id = GuideBuilder.category_counter
        GuideBuilder.category_counter += 1
        return id

    @staticmethod
    def to_html_hash(text):
        return text.rsplit(".", 1)[0].replace(" ", "-")

    # WARN: Maybe we would want to reload the files from disk everytime ?
    def generate_guide_data(self):
        return self.categories
