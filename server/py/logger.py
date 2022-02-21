import sys


class Logger:
    def __init__(self, debug=True):
        self.stdout = sys.stdout
        self.debug = debug
        sys.stdout = self

    def enable_debug_log(self):
        self.debug = True

    def disable_debug_log(self):
        self.debug = False

    def write(self, msg):
        if self.debug:
            self.stdout.write(msg)
        self.flush()

    def flush(self):
        self.stdout.flush()


# Create the logger at global scope
Logger(True)
