import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import mapReducer from './reducers/map';
import analysisReducer, { updateStudyAreaFiles } from './reducers/analysis';
import ServerMiddleware, {
  sendFiles as serverSendFilesAction,
  subscribe as serverSubscribeAction,
} from './middlewares/ServerMiddleware';
import StudyAreaMiddleware from './middlewares/StudyAreaMiddleware';

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
    }).concat([ServerMiddleware, StudyAreaMiddleware]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
