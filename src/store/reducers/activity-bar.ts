import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IActivityModel } from 'models/ActivityModel';
import { RootState } from 'store/store';

export const activityBarSlice = createSlice({
  name: 'activity-bar',
  initialState: {
    active: 'ssanto.search',
    activities: [
      { id: 'ssanto.explorer', label: 'explorer', iconName: 'VscFiles' },
      { id: 'ssanto.search', label: 'search', iconName: 'VscSearch' },
      {
        id: 'ssanto.extensions',
        label: 'extensions',
        iconName: 'VscExtensions',
      },
    ],
    options: [
      { id: 'ssanto.accounts', label: 'accounts', iconName: 'VscAccount' },
      { id: 'ssanto.manage', label: 'manage', iconName: 'VscSettingsGear' },
    ],
  },
  reducers: {
    addActivity: (state, { payload }: PayloadAction<IActivityModel>) => {
      state.activities.push({ ...payload });
    },
    removeActivity: (state, { payload: activityId }: PayloadAction<string>) => {
      state.activities = state.activities.filter(
        activity => activity.id !== activityId
      );
    },

    addOption: (state, { payload }: PayloadAction<IActivityModel>) => {
      state.activities.push({ ...payload });
    },
    removeOption: (state, { payload: optionId }: PayloadAction<string>) => {
      state.options = state.options.filter(option => option.id !== optionId);
    },

    setActive: (state, { payload: activityId }: PayloadAction<string>) => {
      state.active = activityId;
    },
  },
});

export const {
  addActivity,
  removeActivity,
  addOption,
  removeOption,
  setActive,
} = activityBarSlice.actions;

export const selectActivityBar = (state: RootState) => state.activityBar;

export default activityBarSlice.reducer;
