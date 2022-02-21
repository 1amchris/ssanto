
###
# For test purposes

class AClass:
    def __init__(self):
        self.attribute = "myString"

    def method(self):
        print("This method was called from javascript and contain", self.attribute)


a_class = AClass()


def function():
    print("This function was called from javascript")

###