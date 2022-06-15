/* eslint-disable no-unused-vars */

enum ServerSubscriptionTarget {
  WorkspaceManagerFiles = 'workspace_manager.files',

  FileManagerShapefiles = 'file_manager.shapefiles',

  LogsManagerLogs = 'logs_manager.logs',

  ViewsManagerEditorViews = 'views_manager.editor.views',
  ViewsManagerActiveEditorViews = 'views_manager.editor.active_views',
  ViewsManagerPanelViews = 'views_manager.panel.activities',
  ViewsManagerActivePanelView = 'views_manager.panel.active_view',
  ViewsManagerSidebarViews = 'views_manager.sidebar.activities',
  ViewsManagerActiveSidebarView = 'views_manager.sidebar.active_view',

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
