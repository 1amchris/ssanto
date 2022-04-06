enum ServerSubscriptionTargets {
  FileManagerFiles = 'file_manager.files',
  FileManagerShapefiles = 'file_manager.shapefiles',
  MapCursor = 'map.cursor',
  MapCursorInformations = 'map.cursor.informations',
  MapCenter = 'map.center',
  Layer = 'layers',
  AnalysisResult = 'analysis',
  AnalysisParameters = 'parameters',
  AnalysisStudyArea = 'study_area',
  AnalysisNbsSystem = 'nbs_system',
  AnalysisObjectives = 'objectives',
  AnalysisValueScaling = 'value_scaling',
  AnalysisDefaultMissingData = 'default_missing_data',
  AnalysisGraphSuitabilityCategories = 'analysis.visualization.suitability_categories',
  AnalysisGraphSuitabilityThreshold = 'analysis.visualization.suitability_threshold',
  AnalysisGraphSuitabilityAboveThreshold = 'analysis.visualization.suitability_above_threshold',
}

export default ServerSubscriptionTargets;
