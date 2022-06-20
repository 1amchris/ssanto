from views.views import ViewMetadata


class FileExplorerView(ViewMetadata):
    def __init__(self, root: str):
        super().__init__("explorer", root, "file-explorer")


class FileSearcherView(ViewMetadata):
    def __init__(self, root: str):
        super().__init__("search", root, "file-searcher")


class OutputView(ViewMetadata):
    def __init__(self, root: str):
        super().__init__("output", root, "output")


class ProblemExplorerView(ViewMetadata):
    def __init__(self, root: str):
        super().__init__("problems-explorer", root, "problems-explorer")
