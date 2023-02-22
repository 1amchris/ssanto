import os
from guide.category import Category


class GuideBuilder:
    topic_counter = 0
    category_counter = 0

    def __init__(self):
        self.categories = []
        path = os.path.join(os.getcwd(), "data/guide")
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

    # WARN: Maybe we would want to reload the files from disk everytime ?
    def get_guide(self):
        return self.categories
