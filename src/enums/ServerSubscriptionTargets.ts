enum ServerSubscriptionTargets {
  FileManagerFiles = 'file_manager.files',
  FileManagerShapefiles = 'file_manager.shapefiles',
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

export default ServerSubscriptionTargets;