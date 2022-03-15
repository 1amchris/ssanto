import sys


class Logger:
    # max_line_length: -1 to see all the text
    def __init__(self, debug=True, max_line_length=-1):
        self.stdout = sys.stdout
        self.debug = debug
        self.max_line_length = max_line_length
        sys.stdout = self

    def enable_debug_log(self):
        self.debug = True

    def disable_debug_log(self):
        self.debug = False

    def write(self, msg):
        if self.debug:
            printed_msg = msg if self.max_line_length < 0 else self.truncate_middle(msg, self.max_line_length)
            self.stdout.write(printed_msg)
        self.flush()

    def truncate_middle(self, string, max_length):
        if len(string) <= max_length:
            return string
        part_2 = max_length // 2 - 3
        part_1 = max_length - part_2 - 3
        return "{0}...{1}".format(string[:part_1], string[-part_2:])

    def flush(self):
        self.stdout.flush()


# Create the logger at global scope
Logger(True, -1)
