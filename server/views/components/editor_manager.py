from files.document_manager import DocumentsManager
from files.errors import UnsavedFileError
from files.serializable import Serializable
from logger.log_manager import LogsManager
from subjects.subjects_manager import SubjectsManager
from views.groups import ViewGroup
from views.view_controller_registry import ViewControllerRegistry
from toasts_manager import ToastsManager, ToastAction


class EditorManager(Serializable):
    def __init__(
        self, subjects: SubjectsManager, logger: LogsManager, documents: DocumentsManager, toaster: ToastsManager
    ):
        super().__init__()
        self.subjects = subjects
        self.logger = logger
        self.toaster = toaster
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
        index = index if index is not None else len(self.__editor_views.value())
        group = ViewGroup()
        self.__editor_views.value().insert(index, group)
        self.__active_views.value().insert(0, group.uri)
        self.__active_views.update()
        self.__editor_views.update()
        self.logger.info(f"[Editor] Added editor group {group.uri}")
        return self.select_group(group.uri)

    def add_view(self, view_source, view_type: str = None, group_id: str = None, prevent_duplicates=False):
        groups = self.__editor_views.value()

        if prevent_duplicates:
            for group_uri in self.__active_views.value():
                group = next(filter(lambda group: group.uri == group_uri, groups))
                existing_view = next(
                    filter(
                        (lambda view: view.source == view_source)
                        if view_type is None
                        else (lambda v: (v.source, v.view_type) == (view_source, view_type)),
                        group.views,
                    ),
                    None,
                )
                if existing_view is not None:
                    return self.select_view(existing_view.uri, group_uri)

        group_id = group_id if group_id else self.__active_views.value()[0]
        group = next(filter(lambda group: group.uri == group_id, groups), None)

        if group is None:
            self.logger.error(f"[Editor] No editor group found for {group_id}")
            raise KeyError(f"No editor group found for {group_id}")

        else:
            document = self.documents.open(view_source)
            if document is not None and view_type is None:
                view_type = document.get_default_view_type()
            controller = ViewControllerRegistry()[view_type](
                source=view_source,
                document=document,
                onchange=lambda *_: self.__editor_views.update(),
                onsave=lambda *_: self.__editor_views.update(),
            )

            group.views.append(controller)
            group.active.insert(0, controller.uri)
            self.__editor_views.update()

            self.logger.info(f"[Editor] Added view {controller.uri}")
            return self.select_view(controller.uri, group.uri)

    def has_view(self, view_uri: str):
        return (
            next(
                filter(lambda group: view_uri in list(map(lambda v: v.uri, group.views)), self.__editor_views.value()),
                None,
            )
            is not None
        )

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

        else:
            active_views = list(filter(lambda g: g != group_id, self.__active_views.value()))
            groups = list(filter(lambda g: g.uri != group_id, groups))

            self.logger.info(f"[Editor] Deleted editor group {group_id}")

            if len(groups) == 0:
                group = ViewGroup()
                active_views = [group.uri]
                groups = [group]

            self.__active_views.notify(active_views)
            self.__editor_views.notify(groups)
            return self.select_group(active_views[0])

    def remove_view(self, view_uri: str, group_id: str = None, save: bool = False, allow_closing_if_modified=False):
        groups = self.__editor_views.value()
        group_id = group_id if group_id else self.__active_views.value()[0]
        group = next(filter(lambda group: group.uri == group_id, groups), None)

        if group is None:
            self.logger.error(f"[Editor] No editor group found for {group_id}")
            raise KeyError(f"No editor group found for {group_id}")

        elif view_uri not in list(map(lambda v: v.uri, group.views)) or view_uri not in group.active:
            self.logger.error(f"[Editor] No view found for {view_uri} in editor group {group_id}")
            raise KeyError(f"No view found for {view_uri} in editor group {group_id}")

        else:
            try:
                source_uri = next(filter(lambda v: v.uri == view_uri, group.views)).source
                self.documents.close(source_uri, save=save, allow_closing_if_modified=allow_closing_if_modified)
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

                self.logger.info(f"[Editor] Deleted {view_uri}")

                self.__editor_views.notify(groups)
                self.__active_views.notify(active)
                return view_uri

            except UnsavedFileError as e:
                self.logger.error(
                    f"[Editor] An attempt at closing the document was made. The operation failed, as the document contained unsaved modifications."
                )
                self.toaster.error(
                    message=f"Unsaved modifications in {source_uri.split('/')[-1]}. What would you like to do?",
                    duration=None,
                    actions=[
                        ToastAction("Save and close", lambda *_, **__: self.remove_view(view_uri, group_id, save=True)),
                        ToastAction(
                            "Close without saving",
                            lambda *_, **__: self.remove_view(
                                view_uri,
                                group_id,
                                save=False,
                                allow_closing_if_modified=True,
                            ),
                        ),
                        ToastAction("Cancel", None),
                    ],
                )

            except IOError as e:
                self.logger.error(f"[Editor] Failed to close document {source_uri}: {e}")
                raise e

    def remove_all(self, save: bool = False, allow_closing_if_modified=False):
        new_groups = []
        for group in self.__editor_views.value():
            group_views = []
            for view in group.views:
                try:
                    self.documents.close(view.source, save=save, allow_closing_if_modified=allow_closing_if_modified)

                except UnsavedFileError:
                    group_views += [view]

            if len(group_views) > 0:
                group.views = group_views
                views_uris = list(map(lambda v: v.uri, group_views))
                group.active = list(filter(lambda v: v in views_uris, group.active))
                new_groups += [group]

        if len(new_groups) > 0:
            group_uris = list(map(lambda g: g.uri, new_groups))
            new_active = list(filter(lambda g: g in group_uris, self.__active_views.value()))
            self.__editor_views.notify(new_groups)
            self.__active_views.notify(new_active)
            self.logger.error(f"[Editor] Failed to close all documents.")
            raise UnsavedFileError("Failed to close all documents.")

        new_groups = [ViewGroup()]
        new_active = [new_groups[0].uri]
        self.__editor_views.notify(new_groups)
        self.__active_views.notify(new_active)
        self.logger.info(f"[Editor] Closed all documents.")

    def save(self):
        if len(self.__active_views.value()) == 0:
            self.logger.error("[Editor] No editor groups found")
            raise KeyError("No editor groups found")

        active_group_uri = self.__active_views.value()[0]
        group = next(filter(lambda group: group.uri == active_group_uri, self.__editor_views.value()), None)

        if group is None:
            self.logger.error(f"[Editor] No editor group found for {active_group_uri}")
            raise KeyError(f"No editor group found for {active_group_uri}")

        if len(group.active) == 0:
            self.logger.info(f"[Editor] Nothing to save")
            return None

        active_view_uri = group.active[0]
        view = next(filter(lambda view: view.uri == active_view_uri, group.views), None)

        if view is None:
            self.logger.error(f"[Editor] No view found for {active_view_uri} in editor group {group.uri}")
            raise KeyError(f"No view found for {active_view_uri} in editor group {group.uri}")

        view.save()
        self.logger.info(f"[Editor] Saved {view.uri}")
        return view.uri

    def save_all(self):
        saved = []
        for group in self.__editor_views.value():
            for view in group.views:
                view.save()
                saved.append(view.uri)

        self.logger.info("[Editor] Saved all views")
        return saved

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

    def update_view(self, view_uri: str, changes: dict):
        for group in self.__editor_views.value():
            for view in group.views:
                if view.uri == view_uri:
                    break
            else:
                view = None

            if view is not None:
                break

        if view is None:
            self.logger.error(f"[Editor] No view found for {view_uri}")
            raise KeyError(f"No view found for {view_uri}")

        else:
            # self.logger.info(f"[Editor] Updating view {view_uri}")
            return view.update(changes)
