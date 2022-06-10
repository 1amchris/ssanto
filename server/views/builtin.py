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
