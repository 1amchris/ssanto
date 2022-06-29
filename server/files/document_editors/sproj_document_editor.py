from files.document_editors.json_document_editor import JSONDocumentEditor
from datetime import datetime


class SSantoDocumentEditor(JSONDocumentEditor):
    default_view = "ssanto-map"

    def __get_value(self, key):
        segments = key.split(".")
        scope = self.content
        for segment in segments[:-1]:
            if segment not in scope:
                return None
            scope = scope[segment]
        return scope[segments[-1]]

    def _update(self, changes: dict):

        changes["analysis.modifiedOn"] = str(datetime.date(datetime.now()))

        studyAreaKey = "analysis.studyArea"
        if studyAreaKey in changes and changes[studyAreaKey] != self.__get_value(studyAreaKey):
            studyAreaPath = changes[studyAreaKey]
            if studyAreaPath is not None:
                # TODO: compute study area from file
                pass
            else:
                # TODO: reset the study area svg
                pass

        for segments in filter(None, map(lambda key: key.split("."), changes.keys())):
            scope = self.content
            for segment in segments[:-1]:
                if segment not in scope:
                    scope[segment] = {}
                scope = scope[segment]
            scope[segments[-1]] = changes[".".join(segments)]

        return segments is not None
