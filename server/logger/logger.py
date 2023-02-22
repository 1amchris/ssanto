import sys
import os


class Logger:
    LOGGING_FILE = "server.log"

    def __init__(self, debug=True, log=True, max_line_length=None):
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

    def write(self, message):
        if self.debug:
            self.stdout.write(self.format(message))
        if self.log:
            self.logging_file.write(message)

        self.flush()

    def format(self, message):
        if self.max_line_length is None or len(message) <= self.max_line_length:
            return message

        index_cut_start = self.max_line_length // 2 - 3
        index_cut_end = self.max_line_length - index_cut_start - 3
        return f"{message[:index_cut_end]}...{message[-index_cut_start:]}"

    def flush(self):
        self.stdout.flush()
        self.logging_file.flush()


# Create the logger at global scope
# Logger(debug=True, log=True, max_line_length=80)
Logger(debug=True, log=True)
