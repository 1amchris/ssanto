/* eslint-disable no-unused-vars */

enum ServerSubscriptionTarget {
  FileManagerFiles = 'file_manager.files',
  FileManagerShapefiles = 'file_manager.shapefiles',

  LogsManagerLogs = 'logs_manager.logs',

  ViewsManagerViews = 'views_manager.views',
  ViewsManagerActiveViews = 'views_manager.active_views',

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
