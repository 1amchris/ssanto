from views.views import View


class FileExplorerView(View):
    def __init__(self, root: str):
        super().__init__("explorer", root)

    def get_view_type(self):
        return "file-explorer"


class FileSearcherView(View):
    def __init__(self, root: str):
        super().__init__("search", root)

    def get_view_type(self):
        return "file-searcher"


class OutputView(View):
    def __init__(self, root: str):
        super().__init__("output", root)

    def get_view_type(self):
        return "output"


class ProblemExplorerView(View):
    def __init__(self, root: str):
        super().__init__("problems-explorer", root)

    def get_view_type(self):
        return "problems-explorer"
