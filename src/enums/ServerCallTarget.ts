/* eslint-disable no-unused-vars */

enum ServerCallTarget {
  WorkspaceManagerOpenFile = 'workspace_manager.open_file',
  WorkspaceManagerOpenWorkspace = 'workspace_manager.open_workspace',
  WorkspaceManagerCloseWorkspace = 'workspace_manager.close_workspace',

  FileManagerGetFiles = 'files_manager.get_files',

  LogsManagerLog = 'logs_manager.add_log',

  ViewsManagerOpenEditorGroup = 'views_manager.editor.add_group',
  ViewsManagerSelectEditorGroup = 'views_manager.editor.select_group',
  ViewsManagerCloseEditorGroup = 'views_manager.editor.close_group',
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

  AnalysisAddFiles = 'analysis.add_files',
  AnalysisRemoveFile = 'analysis.remove_file',

  AnalysisExportTiff = 'analysis.export_tiff',
  AnalysisGetLayer = 'analysis.get_layer',

  AnalysisOpenProject = 'analysis.open_project',
  AnalysisSaveProject = 'analysis.save_project',
  AnalysisSaveWeights = 'analysis.save_weights',
  AnalysisSaveObjectiveHierarchy = 'analysis.save_objective_hierarchy',

  AnalysisUpdateParams = 'analysis.update',
  AnalysisUpdateStudyAreaFiles = 'analysis.set_study_area',
  AnalysisUpdateSuitabilityThreshold = 'analysis.update_suitability_threshold',
  AnalysisComputeSuitability = 'analysis.compute_suitability',

  MapSetCursor = 'map.set_cursor',

  GuideGet = 'guide.get',
}

export default ServerCallTarget;
