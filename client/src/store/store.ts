import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import mapReducer from 'store/reducers/map';
import guideReducer from 'store/reducers/guide';
import analysisReducer, { sendProperties } from 'store/reducers/analysis';
import ServerMiddleware, {
  call,
  sendFiles as serverSendFilesAction,
  subscribe as serverSubscribeAction,
} from 'store/middlewares/ServerMiddleware';
import AnalysisMiddleware from 'store/middlewares/AnalysisMiddleware';

export const store = configureStore({
  reducer: {
    analysis: analysisReducer,
    map: mapReducer,
    guide: guideReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          serverSubscribeAction.type, // contains a callback function
          serverSendFilesAction.type, // contains files
          sendProperties.type, // May contain uploaded files
          call.type, // May contain uploaded files
        ],
      },
    }).concat([ServerMiddleware, AnalysisMiddleware]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
