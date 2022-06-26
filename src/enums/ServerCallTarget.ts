/* eslint-disable no-unused-vars */

enum ServerCallTarget {
  FilesGetFiles = 'files.get_files',

  LoggerLog = 'logger.add_log',

  WorkspaceOpenView = 'workspace.open_view',
  WorkspaceOpenWorkspace = 'workspace.open_workspace',
  WorkspaceCloseWorkspace = 'workspace.close_workspace',

  WorkspaceViewsOpenEditorGroup = 'workspace.views.editor.add_group',
  WorkspaceViewsSelectEditorGroup = 'workspace.views.editor.select_group',
  WorkspaceViewsCloseEditorGroup = 'workspace.views.editor.close_group',
  WorkspaceViewsSelectEditor = 'workspace.views.editor.select_view',
  WorkspaceViewsOpenEditor = 'workspace.views.editor.open_view',
  WorkspaceViewsCloseEditor = 'workspace.views.editor.close_view',
  WorkspaceViewsPublishChanges = 'workspace.views.publish_changes',

  WorkspaceViewsSelectPanel = 'workspace.views.panel.select_activity',
  WorkspaceViewsSelectPanelView = 'workspace.views.panel.select_view',
  WorkspaceViewsOpenPanelView = 'workspace.views.panel.open_view',
  WorkspaceViewsClosePanelView = 'workspace.views.panel.close_view',

  WorkspaceViewsSelectActivity = 'workspace.views.sidebar.select_activity',
  WorkspaceViewsSelectActivityView = 'workspace.views.sidebar.select_view',
  WorkspaceViewsOpenActivityView = 'workspace.views.sidebar.open_view',
  WorkspaceViewsCloseActivityView = 'workspace.views.sidebar.close_view',

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
