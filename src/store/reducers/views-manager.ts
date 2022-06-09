import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { uniqueId } from 'lodash';
import { RootState } from 'store/store';
import ViewGroupModel from 'models/ViewGroupModel';
import ViewModel from 'models/ViewModel';
import SetActiveTabModel from 'models/SetActiveTabModel';
import CloseTabModel from 'models/CloseTabModel';
import OpenTabModel from 'models/OpenTabModel';

function createView(name: string) {
  return {
    name: name,
    source: `file:///src/${name}`,
    uri: `view:///src/${name}`,
  } as ViewModel;
}

const uniqueViewGroupUri = () => uniqueId('view-group://');

export const viewsManagerSlice = createSlice({
  name: 'views-manager',
  initialState: {
    active: ['view-group://1', 'view-group://2', 'view-group://3'],
    groups: [
      {
        uri: 'view-group:///1',
        active: [
          `view:///src/EditorGroup.tsx`,
          `view:///src/SplitView.tsx`,
          `view:///src/TreeView.tsx`,
          `view:///src/Output.tsx`,
        ],
        views: [
          createView('EditorGroup.tsx'),
          createView('TreeView.tsx'),
          createView('SplitView.tsx'),
          createView('Output.tsx'),
        ],
      },
      {
        uri: 'view-group:///2',
        active: [
          `view:///src/EditorGroup.tsx`,
          `view:///src/SplitView.tsx`,
          `view:///src/TreeView.tsx`,
        ],
        views: [
          createView('EditorGroup.tsx'),
          createView('TreeView.tsx'),
          createView('SplitView.tsx'),
        ],
      },
      {
        uri: 'view-group:///3',
        active: [`view:///src/TreeView.tsx`, `view:///src/Output.tsx`],
        views: [createView('TreeView.tsx'), createView('Output.tsx')],
      },
    ] as ViewGroupModel[],
  },
  reducers: {
    openView: (
      state,
      { payload: { uri, groupId } }: PayloadAction<OpenTabModel>
    ) => {
      const groupUri = groupId || state.active;
      const group = state.groups.find(group => group.uri === groupUri);
      if (group) {
        group.views = [...group.views, createView(uri)];
        group.active = [uri, ...group.active];
      } else {
        const newView = {
          uri: `view://${uri.substring(uri.indexOf('://') + 3)}`,
          source: uri,
          name: uri.substring(uri.lastIndexOf('/') + 1),
        };
        state.groups = [
          ...state.groups,
          {
            uri: uniqueViewGroupUri(),
            active: [newView.uri],
            views: [newView],
          },
        ];
        state.active = [state.groups.slice(-1)[0].uri, ...state.active];
      }
    },
    closeView: (
      state,
      { payload: { groupId, viewId } }: PayloadAction<CloseTabModel>
    ) => {
      const group = state.groups.find(group => group.uri === groupId);
      if (group) {
        group.views = group.views.filter(view => view.uri !== viewId);
        group.active = group.active.filter(uri => uri !== viewId);
        if (group.views.length === 0) {
          state.groups = state.groups.filter(group => group.uri !== groupId);
        }
        if (state.groups.length === 0) {
          state.groups = [
            {
              uri: uniqueViewGroupUri(),
              active: [],
              views: [],
            },
          ];
        }
      }
    },

    setActive: (
      state,
      { payload: { groupId, viewId } }: PayloadAction<SetActiveTabModel>
    ) => {
      state.active = [
        groupId,
        ...state.active.filter(group => group !== groupId),
      ];
      state.groups.forEach(group => {
        if (group.uri === groupId) {
          group.active = [viewId, ...group.active.filter(id => id !== viewId)];
        }
      });
    },
  },
});

export const { setActive, openView, closeView } = viewsManagerSlice.actions;

export const selectViewsManager = (state: RootState) => state.viewsManager;

export default viewsManagerSlice.reducer;
