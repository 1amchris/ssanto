import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import ViewGroupModel from 'models/ViewGroupModel';

export const viewsManagerSlice = createSlice({
  name: 'views-manager',
  initialState: {
    editor: {
      active: [] as string[],
      groups: [
        {
          uri: 'view-group://editor-placeholder',
          active: [],
          views: [],
        },
      ] as ViewGroupModel[],
    },
    panel: {
      active: undefined as string | undefined,
      activities: [
        {
          uri: 'view-group://panel-placeholder',
          active: [],
          views: [],
          icon: 'VscRefresh',
          label: 'placeholder',
        },
      ] as ViewGroupModel[],
    },
    sidebar: {
      active: undefined as string | undefined,
      activities: [
        {
          uri: 'view-group://sidebar-placeholder',
          active: [],
          views: [],
          icon: 'VscRefresh',
          label: 'placeholder',
        },
      ] as ViewGroupModel[],
      options: [
        {
          uri: `accounts://`,
          label: 'accounts',
          icon: 'VscAccount',
        },
        {
          uri: `settings://`,
          label: 'manage',
          icon: 'VscSettingsGear',
        },
      ],
    },
  },
  reducers: {
    setEditorViews: (
      state,
      { payload: groups }: PayloadAction<ViewGroupModel[]>
    ) => {
      state.editor.groups = groups;
    },
    setActiveEditorViews: (
      state,
      { payload: active }: PayloadAction<string[]>
    ) => {
      state.editor.active = active;
    },
    setPanelViews: (
      state,
      { payload: activities }: PayloadAction<ViewGroupModel[]>
    ) => {
      state.panel.activities = activities;
    },
    setActivePanelView: (state, { payload: active }: PayloadAction<string>) => {
      state.panel.active = active;
    },
    setSidebarViews: (
      state,
      { payload: activities }: PayloadAction<ViewGroupModel[]>
    ) => {
      state.sidebar.activities = activities;
    },
    setActiveSidebarView: (
      state,
      { payload: active }: PayloadAction<string>
    ) => {
      state.sidebar.active = active;
    },
  },
});

export const {
  setEditorViews,
  setActiveEditorViews,
  setPanelViews,
  setActivePanelView,
  setSidebarViews,
  setActiveSidebarView,
} = viewsManagerSlice.actions;

export const selectViewsManager = (state: RootState) => state.viewsManager;

export default viewsManagerSlice.reducer;
