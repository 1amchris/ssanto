import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import ViewGroupModel from 'models/ViewGroupModel';

export const viewsManagerSlice = createSlice({
  name: 'views-manager',
  initialState: {
    active: [] as string[],
    groups: [
      {
        uri: 'view-group://placeholder',
        active: [],
        views: [],
      },
    ] as ViewGroupModel[],
  },
  reducers: {
    setViews: (state, { payload: groups }: PayloadAction<ViewGroupModel[]>) => {
      console.log('setViews', groups);
      state.groups = groups;
    },
    setActiveViews: (state, { payload: active }: PayloadAction<string[]>) => {
      console.log('setActiveViews', active);
      state.active = active;
    },
  },
});

export const { setViews, setActiveViews } = viewsManagerSlice.actions;

export const selectViewsManager = (state: RootState) => state.viewsManager;

export default viewsManagerSlice.reducer;
