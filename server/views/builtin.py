from views.views import View


class FileExplorerView(View):
    def __init__(self, root: str):
        super().__init__("explorer", root, "file-explorer")


class FileSearcherView(View):
    def __init__(self, root: str):
        super().__init__("search", root, "file-searcher")


class OutputView(View):
    def __init__(self, root: str):
        super().__init__("output", root, "output")


class ProblemExplorerView(View):
    def __init__(self, root: str):
        super().__init__("problems-explorer", root, "problems-explorer")
