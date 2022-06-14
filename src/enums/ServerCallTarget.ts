/* eslint-disable no-unused-vars */

// TODO: there are many inconsistencies in the the enum. Some have "namespaces", some don't. Some are plural, some aren't.
enum ServerCallTarget {
  FilesOpenWorkspace = 'files.open_workspace',
  FilesCloseWorkspace = 'files.close_workspace',
  FilesOpenFile = 'files.open_file',

  LogsManagerLog = 'logs_manager.add_log',

  ViewsManagerOpenEditorGroup = 'views_manager.editor.add_group',
  ViewsManagerSelectEditorGroup = 'views_manager.editor.select_group',
  ViewsManagerSelectEditor = 'views_manager.editor.select_view',
  ViewsManagerOpenEditor = 'views_manager.editor.open_view',
  ViewsManagerCloseEditor = 'views_manager.editor.close_view',

  ViewsManagerSelectPanel = 'views_manager.panel.select_activity',
  ViewsManagerSelectPanelView = 'views_manager.panel.select_view',
  ViewsManagerOpenPanelView = 'views_manager.panel.open_view',
  ViewsManagerClosePanelView = 'views_manager.panel.close_view',

  ViewsManagerSelectActivity = 'views_manager.sidebar.select_activity',
  ViewsManagerSelectActivityView = 'views_manager.sidebar.select_view',
  ViewsManagerOpenActivityView = 'views_manager.sidebar.open_view',
  ViewsManagerCloseActivityView = 'views_manager.sidebar.close_view',

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
