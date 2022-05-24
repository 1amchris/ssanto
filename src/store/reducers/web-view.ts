import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';

export const webViewSlice = createSlice({
  name: 'web-view',
  initialState: {
    preventPointerEvents: false,
  },
  reducers: {
    updatePreventPointerEvents: (
      state,
      { payload: preventPointerEvents }: PayloadAction<boolean>
    ) => {
      state.preventPointerEvents = preventPointerEvents;
      console.log({ preventPointerEvents });
    },
  },
});

export const { updatePreventPointerEvents } = webViewSlice.actions;

export const selectWebView = (state: RootState) => state.webView;

export default webViewSlice.reducer;
