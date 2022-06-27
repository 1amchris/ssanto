import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';

interface ToastAction {
  id: string;
  label: string;
}

interface Toast {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  source?: string;
  actions: ToastAction[];
  closeable: boolean;
}

export const toasterSlice = createSlice({
  name: 'toaster',
  initialState: { toasts: [] } as { toasts: Toast[] },
  reducers: {
    setToasts: (state, { payload: toasts }: PayloadAction<Toast[]>) => {
      state.toasts = toasts;
    },
  },
});

export const { setToasts } = toasterSlice.actions;

export const selectToaster = (state: RootState) => state.toaster;

export default toasterSlice.reducer;
