/* eslint-disable no-unused-vars */

// TODO: there are many inconsistencies in the the enum. Some have "namespaces", some don't. Some are plural, some aren't.
enum ServerCallTarget {
  OpenWorkspace = 'files.open_workspace',

  LogsManagerLog = 'logs_manager.add_log',

  SaveProject = 'analysis.save_project',
  OpenProject = 'analysis.open_project',

  Update = 'update',
  UpdateSuitabilityThreshold = 'analysis.update_suitability_threshold',
  ExportTiff = 'analysis.export_tiff',
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
