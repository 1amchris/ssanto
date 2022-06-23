from files.serializable import Serializable
from files.document_manager import DocumentsManager
from logger.log_manager import LogsManager
from subjects.subjects_manager import SubjectsManager
from views.views import ViewMetadata
from views.groups import ViewGroup


class EditorManager(Serializable):
    def __init__(self, subjects: SubjectsManager, logger: LogsManager, documents: DocumentsManager):
        super().__init__()
        self.subjects = subjects
        self.logger = logger
        self.documents = documents

        initial_group = ViewGroup()
        self.__editor_views = self.subjects.create("workspace.views.editor.views", [initial_group])
        self.__active_views = self.subjects.create("workspace.views.editor.active_views", [initial_group.uri])

    def serialize(self):
        return {
            "active": self.__active_views.value(),
            "groups": [group.serialize() for group in self.__editor_views.value()],
        }

    def add_group(self, index=None):
        self.logger.info("[Editor] Adding new group")

        index = index if index else len(self.__editor_views.value())
        group = ViewGroup()
        self.__editor_views.value().insert(index, group)
        self.__active_views.value().insert(0, group.uri)
        self.__active_views.update()
        self.__editor_views.update()
        return self.select_group(group.uri)

    def remove_group(self, group_id: str):
        groups = self.__editor_views.value()
        group = next(filter(lambda group: group.uri == group_id, groups), None)

        if group is None:
            self.logger.error(f"[Editor] No editor group found for {group_id}")
            raise KeyError(f"No editor group found for {group_id}")

        elif len(group.views) > 0:
            self.logger.error(
                f"[Editor] Found views in editor group {group_id}. Cannot close editor group containing views."
            )
            raise KeyError(f"Found views in editor group {group_id}. Cannot close editor group containing views.")

        self.logger.info(f"[Editor] Deleting editor group {group_id}")

        self.__active_views.notify(list(filter(lambda g: g != group_id, self.__active_views.value())))
        self.__editor_views.notify(list(filter(lambda g: g.uri != group_id, groups)))
        return self.select_group(self.__active_views.value()[0])

    def add_view(self, view_source, view_type: str = None, group_id: str = None, prevent_duplicates=True):
        # Replace this with a view controller
        view = ViewMetadata(view_source, view_type=view_type)
        groups = self.__editor_views.value()

        if prevent_duplicates:
            for group_uri in self.__active_views.value():
                group = next(filter(lambda group: group.uri == group_uri, groups))
                existing_view = next(
                    filter(lambda v: (v.source, v.view_type) == (view.source, view.view_type), group.views), None
                )
                if existing_view is not None:
                    return self.select_view(existing_view.uri, group_uri)

        self.logger.info(f"[Editor] Adding {view.uri}")

        group_id = group_id if group_id else self.__active_views.value()[0]
        group = next(filter(lambda group: group.uri == group_id, groups), None)

        if group is None:
            self.logger.error(f"[Editor] No editor group found for {group_id}")
            raise KeyError(f"No editor group found for {group_id}")

        else:
            document = self.documents.open(view.source)
            # TODO: Add hooks to update the view based on the document changes
            # document.subscribe(DocumentEvent.UPDATE, lambda document: print("DOCUMENT UPDATE", document.serialize()))
            # document.subscribe(DocumentEvent.SAVE, lambda document: print("DOCUMENT SAVE", document.serialize()))
            group.views.insert(0, view)
            group.active.insert(0, view.uri)
            self.__editor_views.update()
            return self.select_view(view.uri, group.uri)

    def remove_view(self, view_uri: str, group_id: str = None):
        groups = self.__editor_views.value()
        group_id = group_id if group_id else self.__active_views.value()[0]
        group = next(filter(lambda group: group.uri == group_id, groups), None)

        if group is None:
            self.logger.error(f"[Editor] No editor group found for {group_id}")
            raise KeyError(f"No editor group found for {group_id}")

        elif view_uri not in map(lambda v: v.uri, group.views) or view_uri not in group.active:
            self.logger.error(f"[Editor] No view found for {view_uri} in editor group {group_id}")
            raise KeyError(f"No view found for {view_uri} in editor group {group_id}")

        self.logger.info(f"[Editor] Deleting {view_uri}")

        # TODO: This should throw an exception if the view is not saved when closed
        source_uri = next(filter(lambda v: v.uri == view_uri, group.views)).source
        self.documents.close(source_uri, save=False)

        group.views = list(filter(lambda v: v.uri != view_uri, group.views))
        group.active.remove(view_uri)
        active = self.__active_views.value()

        if len(group.views) == 0:
            groups = list(filter(lambda g: g.uri != group.uri, groups))
            active.remove(group.uri)

        if len(groups) == 0:
            new_group = ViewGroup()
            groups.insert(0, new_group)
            active.insert(0, new_group.uri)

        self.__editor_views.notify(groups)
        self.__active_views.notify(active)
        return view_uri

    def select_group(self, group_id: str):
        if next(filter(lambda group: group.uri == group_id, self.__editor_views.value()), None) is None:
            self.logger.error(f"[Editor] No editor group found for {group_id}")
            raise KeyError(f"No editor group found for {group_id}")

        self.logger.info(f"[Editor] Setting active editor group to {group_id}")

        self.__active_views.value().remove(group_id)
        self.__active_views.value().insert(0, group_id)
        self.__active_views.update()
        return group_id

    def select_view(self, view_uri: str, group_id: str = None):
        groups = self.__editor_views.value()
        group_id = group_id if group_id else self.__active_views.value()[0]
        group = next(filter(lambda group: group.uri == group_id, groups), None)

        if group is None:
            self.logger.error(f"[Editor] No editor group found for {group_id}")
            raise KeyError(f"No editor group found for {group_id}")

        elif view_uri not in map(lambda v: v.uri, group.views):
            self.logger.error(f"No view found for {view_uri} in editor group {group_id}")
            raise KeyError(f"No view found for {view_uri} in editor group {group_id}")

        self.logger.info(f"[Editor] Setting active view to {view_uri} for editor group {group_id}")

        group.active.remove(view_uri)
        group.active.insert(0, view_uri)
        self.__editor_views.update()
        self.__active_views.value().remove(group_id)
        self.__active_views.value().insert(0, group_id)
        self.__active_views.update()
        return view_uri
