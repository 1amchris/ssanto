/* eslint-disable no-unused-vars */

enum ServerCallTarget {
  Update = 'update',
  UpdateSuitabilityThreshold = 'analysis.update_suitability_threshold',
  ExportTiff = 'analysis.export_tiff',
  SaveProject = 'analysis.save_project',
  OpenProject = 'analysis.open_project',
  SaveWeights = 'analysis.save_weights',
  SaveObjectiveHierarchy = 'analysis.save_objective_hierarchy',
  UpdateStudyAreaFiles = 'analysis.set_study_area',
  ComputeSuitability = 'compute_suitability',

  GetLayer = 'get_layer',

  FileManagerGetFiles = 'file_manager.get_files',
  FileManagerAddFiles = 'file_manager.add_files',
  FileManagerRemoveFile = 'file_manager.remove_file',

  GetCellSuitability = 'get_cell_suitability',
  MapSetCursor = 'map.set_cursor',

  GuideGet = 'guide.get',
}

export default ServerCallTarget;