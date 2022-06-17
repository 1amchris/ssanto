/* eslint-disable no-unused-vars */

enum ServerSubscriptionTarget {
  WorkspaceFiles = 'workspace.files',

  FilesShapefiles = 'files.shapefiles',

  LoggerLogs = 'logger.logs',

  WorkspaceViewsEditorViews = 'workspace.views.editor.views',
  WorkspaceViewsActiveEditorViews = 'workspace.views.editor.active_views',
  WorkspaceViewsPanelViews = 'workspace.views.panel.activities',
  WorkspaceViewsActivePanelView = 'workspace.views.panel.active_view',
  WorkspaceViewsSidebarViews = 'workspace.views.sidebar.activities',
  WorkspaceViewsActiveSidebarView = 'workspace.views.sidebar.active_view',

  MapCursor = 'map.cursor',
  MapCursorInformations = 'map.cursor.informations',
  MapCenter = 'map.center',

  Layer = 'layers',

  AnalysisResult = 'analysis',
  SubAnalysisResult = 'sub_analysis',
  AnalysisParameters = 'parameters',
  AnalysisStudyArea = 'study_area',
  AnalysisNbsSystem = 'nbs_system',
  AnalysisObjectivesData = 'objectives_data',
  AnalysisObjectives = 'objectives',
  AnalysisValueScaling = 'value_scaling',
  AnalysisGraphSuitabilityCategories = 'analysis.visualization.suitability_categories',
  AnalysisGraphSuitabilityThreshold = 'analysis.visualization.suitability_threshold',
  AnalysisGraphSuitabilityAboveThreshold = 'analysis.visualization.suitability_above_threshold',
}

export default ServerSubscriptionTarget;
