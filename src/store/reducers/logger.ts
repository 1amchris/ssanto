import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LogType } from 'enums/LogType';
import { RootState } from 'store/store';
import ICreateLog from 'models/ICreateLog';
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
    log: (state, { payload: { message, type } }: PayloadAction<ICreateLog>) => {
      (state.logs as any)[type].push({
        message,
        type,
        time: Date.now(),
      });
    },
    setLogs: (state, { payload: logs }: PayloadAction<Logs>) => {
      console.log('setLogs', logs);
      state.logs = logs;
    },
    clearLogs: state => {
      state.logs = {
        [LogType.Tip]: [],
        [LogType.Info]: [],
        [LogType.Warn]: [],
        [LogType.Error]: [],
        [LogType.Critical]: [],
        [LogType.Success]: [],
      };
    },
  },
});

export const { log, setLogs, clearLogs, setActive } = loggerSlice.actions;

export const selectLogger = (state: RootState) => state.logger;

export default loggerSlice.reducer;
