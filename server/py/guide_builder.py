from unicodedata import category


class Topic:
    def __init__(self, name, label):
        self.name = name
        self.label = label
        self.content = ""

    def set_content(self, content):
        self.content = content
        return self

class Category:
    def __init__(self, name, label):
        self.name = name
        self.label = label
        self.topics = []

    def add_topic(self, name, label):
        t = Topic(name, label)
        self.topics.append(t)
        return t

class GuideBuilder:
    def __init__(self):
        self.categories = []
        self.add_categories('category_1', 'category 1') \
            .add_topic('topic_1', 'topic 1') \
            .set_content('This is a text in *mark*__down__')

        self.add_categories('category_2', 'category 2') \
            .add_topic('topic_1', 'topic 1') \
            .set_content('This is a text in *mark*__down__')

    def add_categories(self, name, label):
        c = Category(name, label)
        self.categories.append(c)
        return c

    def generate_guide_data(self):
        return self.categories