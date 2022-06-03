import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Panel } from 'enums/Panel';
import IPanelModel from 'models/IPanelModel';
import { RootState } from 'store/store';

export const panelBarSlice = createSlice({
  name: 'panel-bar',
  initialState: {
    active: Panel.Problems,
    panels: [
      { id: Panel.Problems, label: 'problems' } as IPanelModel,
      { id: Panel.Output, label: 'output' } as IPanelModel,
    ],
  },
  reducers: {
    addPanel: (state, { payload }: PayloadAction<IPanelModel>) => {
      state.panels.push({ ...payload });
    },
    removePanel: (state, { payload: panelId }: PayloadAction<string>) => {
      state.panels = state.panels.filter(panel => panel.id !== panelId);
    },

    setActive: (state, { payload: panelId }: PayloadAction<Panel>) => {
      state.active = panelId;
    },
  },
});

export const { addPanel, removePanel, setActive } = panelBarSlice.actions;

export const selectPanelBar = (state: RootState) => state.panelBar;

export default panelBarSlice.reducer;
