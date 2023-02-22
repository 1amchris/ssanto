import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import advisorReducer from 'store/reducers/advisor';
import analysisReducer from 'store/reducers/analysis';
import blobReducer from 'store/reducers/blobber';
import exportReducer from 'store/reducers/export';
import fileReducer from 'store/reducers/files';
import outputReducer from 'store/reducers/logger';
import toastReducer from 'store/reducers/toaster';
import taskReducer from 'store/reducers/tasker';
import viewReducer from 'store/reducers/viewer';
import webViewReducer from 'store/reducers/web-view';
import ServerMiddleware from 'store/middlewares/ServerMiddleware';
import FilesMiddleware from './middlewares/FilesMiddleware';
import { call, subscribe } from 'store/reducers/server';
import BlobberMiddleware from './middlewares/BlobberMiddleware';

export const store = configureStore({
  reducer: {
    advisor: advisorReducer,
    analysis: analysisReducer,
    blobber: blobReducer,
    export: exportReducer,
    files: fileReducer,
    logger: outputReducer,
    tasker: taskReducer,
    toaster: toastReducer,
    viewer: viewReducer,
    webView: webViewReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        warnAfter: 100,
        ignoredActions: [
          subscribe.type, // May contain a callback function
          call.type, // May contain a callback function
        ],
      },
    }).concat([ServerMiddleware, BlobberMiddleware, FilesMiddleware]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
