enum ServerTargets {
  Update = 'update',
  SaveProject = 'analysis.save_project',
  SaveWeights = 'analysis.save_weights',
  SaveObjectiveHierarchy = 'analysis.save_objective_hierarchy',
  UpdateStudyAreaFiles = 'analysis.set_study_area',

  FileManagerGetFiles = 'file_manager.get_files',
  FileManagerAddFiles = 'file_manager.add_files',
  FileManagerRemoveFile = 'file_manager.remove_file',

  GuideGet = 'guide.get',
}

export default ServerTargets;
