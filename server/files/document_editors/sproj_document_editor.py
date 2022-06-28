from files.document_editors.json_document_editor import JSONDocumentEditor


class SSantoDocumentEditor(JSONDocumentEditor):
    default_view = "ssanto-map"

    def _update(self, changes: dict):
        for segments in filter(None, map(lambda key: key.split("."), changes.keys())):
            scope = self.content
            for segment in segments[:-1]:
                if segment not in scope:
                    scope[segment] = {}
                scope = scope[segment]
            scope[segments[-1]] = changes[".".join(segments)]
        return segments is not None
