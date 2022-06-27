from views.views import ViewMetadata


class FileExplorerView(ViewMetadata):
    def __init__(self, root: str):
        super().__init__(name="explorer", source=root, view_type="file-explorer")


class FileSearcherView(ViewMetadata):
    def __init__(self, root: str):
        super().__init__(name="search", source=root, view_type="file-searcher")


class OutputView(ViewMetadata):
    def __init__(self, root: str):
        super().__init__(name="output", source=root, view_type="output")


class ProblemExplorerView(ViewMetadata):
    def __init__(self, root: str):
        super().__init__(name="problems-explorer", source=root, view_type="problems-explorer")
