enum ServerTargets {
  Update = 'update',
  SaveProject = 'analysis.save_project',
  SaveWeights = 'analysis.save_weights',
  SaveObjectiveHierarchy = 'analysis.save_objective_hierarchy',
  UpdateStudyAreaFiles = 'analysis.set_study_area',
  ComputeSuitability = 'compute_suitability',

  FileManagerGetFiles = 'file_manager.get_files',
  FileManagerAddFiles = 'file_manager.add_files',
  FileManagerRemoveFile = 'file_manager.remove_file',

  GetCellSuitability = 'get_cell_suitability',

  GuideGet = 'guide.get',
}

export default ServerTargets;
