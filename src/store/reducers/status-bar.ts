import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IStatusModel } from 'models/StatusModel';
import { RootState } from 'store/store';

export const statusBarSlice = createSlice({
  name: 'status-bar',
  initialState: {
    left: [
      {
        id: 'ssanto.git-branch',
        label: 'ui-overhaul*+',
        iconName: 'VscGitMerge',
      },
      {
        id: 'ssanto.git-synchronize',
        iconName: 'VscSync',
        description: 'Synchronize with Git',
      },
      {
        id: 'ssanto.start',
        iconName: 'VscDebugAlt',
        description: 'Start Analysing',
      },
      {
        id: 'ssanto.person-account',
        label: 'Christophe',
        iconName: 'VscPerson',
        description: 'Sign in to Github.',
      },
      {
        id: 'ssanto.live-share',
        label: 'Live Share',
        iconName: 'VscLiveShare',
        description: 'Start Collaborative Session',
      },
    ],
    right: [
      {
        id: 'ssanto.end-of-line',
        label: 'LF',
        description: 'Select End of Line Sequence',
      },
      {
        id: 'ssanto.language',
        label: 'TypeScript React',
        iconName: 'VscSymbolNamespace',
        description: 'Select Language Mode',
      },
      {
        id: 'ssanto.tslint',
        label: 'TSLint',
        iconName: 'VscWarning',
        description: 'Linter is running.',
      },
      { id: 'ssanto.prettier', label: 'Prettier', iconName: 'VscCheck' },
      {
        id: 'ssanto.feedback',
        iconName: 'VscFeedback',
        description: 'Tweet Feedback',
      },
      {
        id: 'ssanto.notifications',
        iconName: 'VscBell',
        description: 'No Notifications',
      },
    ],
  },
  reducers: {
    addLeft: (state, { payload }: PayloadAction<IStatusModel>) => {
      state.left.push({ ...payload });
    },
    addRight: (state, { payload }: PayloadAction<IStatusModel>) => {
      state.right.push({ ...payload });
    },
    removeItem: (state, { payload: itemId }: PayloadAction<string>) => {
      state.right = state.right.filter(item => item.id !== itemId);
      state.left = state.left.filter(item => item.id !== itemId);
    },
  },
});

export const { addLeft, removeItem, addRight } = statusBarSlice.actions;

export const selectStatusBar = (state: RootState) => state.statusBar;

export default statusBarSlice.reducer;
