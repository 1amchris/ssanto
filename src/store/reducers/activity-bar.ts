import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Activity } from 'enums/Activity';
import { IActivityModel } from 'models/ActivityModel';
import { RootState } from 'store/store';

export const activityBarSlice = createSlice({
  name: 'activity-bar',
  initialState: {
    active: Activity.Explorer as Activity | undefined,
    activities: [
      { id: Activity.Explorer, label: 'explorer', iconName: 'VscFiles' },
      { id: Activity.Search, label: 'search', iconName: 'VscSearch' },
      {
        id: Activity.Extensions,
        label: 'extensions',
        iconName: 'VscExtensions',
      },
    ],
    options: [
      { id: Activity.Accounts, label: 'accounts', iconName: 'VscAccount' },
      { id: Activity.Manage, label: 'manage', iconName: 'VscSettingsGear' },
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

    setActive: (state, { payload: activityId }: PayloadAction<Activity>) => {
      state.active = state.active === activityId ? undefined : activityId;
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
