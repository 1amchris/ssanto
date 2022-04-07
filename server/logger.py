import sys
import os


class Logger:
    LOGGING_FILE = "server.log"
    # max_line_length: -1 to see all the text

    def __init__(self, debug=True, log=True, max_line_length=-1):
        self.stdout = sys.stdout
        self.debug = debug
        self.log = log
        self.max_line_length = max_line_length
        sys.stdout = self

        if os.path.exists(Logger.LOGGING_FILE):
            os.remove(Logger.LOGGING_FILE)
        self.logging_file = open(Logger.LOGGING_FILE, "a")

    def __del__(self):
        self.logging_file.close()

    def enable_debug_log(self):
        self.debug = True

    def disable_debug_log(self):
        self.debug = False

    def write(self, msg):
        if self.debug:
            printed_msg = msg if self.max_line_length < 0 else self.truncate_middle(msg, self.max_line_length)
            self.stdout.write(printed_msg)
        if self.log:
            self.logging_file.write(msg)

        self.flush()

    def truncate_middle(self, string, max_length):
        if len(string) <= max_length:
            return string
        part_2 = max_length // 2 - 3
        part_1 = max_length - part_2 - 3
        return "{0}...{1}".format(string[:part_1], string[-part_2:])

    def flush(self):
        self.stdout.flush()
        self.logging_file.flush()


# Create the logger at global scope
# Replace 120 by the number of characters maximum to be displayed
#  in the terminal per log, or -1 to remove the limit
Logger(True, True, 80)
