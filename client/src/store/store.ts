import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from './reducers/counter';
import mapReducer from './reducers/map';
import analysisReducer, { updateStudyAreaFiles } from './reducers/analysis';
import ServerMiddleware, {
  sendFiles as ServerSendFilesAction,
  subscribe as ServerSubscribeAction,
} from './middlewares/ServerMiddleware';
import StudyAreaMiddleware from './middlewares/StudyAreaMiddleware';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    analysis: analysisReducer,
    map: mapReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          ServerSubscribeAction.type,
          ServerSendFilesAction.type,
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
