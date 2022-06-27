import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LogType } from 'enums/LogType';
import { RootState } from 'store/store';
import Logs from 'models/ILogs';

export const loggerSlice = createSlice({
  name: 'logger',
  initialState: {
    active: LogType.Info,
    logs: {
      [LogType.Tip]: [],
      [LogType.Info]: [],
      [LogType.Warn]: [],
      [LogType.Error]: [],
      [LogType.Critical]: [],
      [LogType.Success]: [],
    },
  } as {
    active: LogType;
    logs: Logs;
  },
  reducers: {
    setActive: (state, action: PayloadAction<LogType>) => {
      state.active = action.payload;
    },
    setLogs: (state, { payload: logs }: PayloadAction<Logs>) => {
      state.logs = logs;
    },
  },
});

export const { setLogs, setActive } = loggerSlice.actions;

export const selectLogger = (state: RootState) => state.logger;

export default loggerSlice.reducer;
