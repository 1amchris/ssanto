import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import mapReducer from 'store/reducers/map';
import analysisReducer, { updateStudyAreaFiles } from 'store/reducers/analysis';
import ServerMiddleware, {
  sendFiles as serverSendFilesAction,
  subscribe as serverSubscribeAction,
} from 'store/middlewares/ServerMiddleware';
import AnalysisMiddleware from 'store/middlewares/AnalysisMiddleware';

export const store = configureStore({
  reducer: {
    analysis: analysisReducer,
    map: mapReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          serverSubscribeAction.type,
          serverSendFilesAction.type,
          updateStudyAreaFiles.type, // Contains a file upload
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
