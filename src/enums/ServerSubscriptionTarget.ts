/* eslint-disable no-unused-vars */

enum ServerSubscriptionTarget {
  BlobberObjectIds = 'blobber.object_ids',

  FilesShapefiles = 'files.shapefiles',

  LoggerLogs = 'logger.logs',

  ToasterToasts = 'toaster.toasts',

  TaskerTasks = 'tasker.tasks',

  WorkspaceFiles = 'workspace.files',

  WorkspaceViewsEditorViews = 'workspace.views.editor.views',
  WorkspaceViewsActiveEditorViews = 'workspace.views.editor.active_views',
  WorkspaceViewsPanelViews = 'workspace.views.panel.activities',
  WorkspaceViewsActivePanelView = 'workspace.views.panel.active_view',
  WorkspaceViewsSidebarViews = 'workspace.views.sidebar.activities',
  WorkspaceViewsActiveSidebarView = 'workspace.views.sidebar.active_view',
}

export default ServerSubscriptionTarget;
