import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import activityBarReducer from 'store/reducers/activity-bar';
import analysisReducer from 'store/reducers/analysis';
import exportReducer from 'store/reducers/export';
import filesReducer from 'store/reducers/files';
import guideReducer from 'store/reducers/guide';
import mapReducer from 'store/reducers/map';
import outputReducer from 'store/reducers/logger';
import panelBarReducer from 'store/reducers/panel-bar';
import statusBarReducer from 'store/reducers/status-bar';
import webViewReducer from 'store/reducers/web-view';
import ServerMiddleware from 'store/middlewares/ServerMiddleware';
import AnalysisMiddleware from 'store/middlewares/AnalysisMiddleware';
import FilesMiddleware from './middlewares/FilesMiddleware';
import { call, subscribe } from 'store/reducers/server';

export const store = configureStore({
  reducer: {
    activityBar: activityBarReducer,
    analysis: analysisReducer,
    export: exportReducer,
    files: filesReducer,
    guide: guideReducer,
    map: mapReducer,
    logger: outputReducer,
    panelBar: panelBarReducer,
    statusBar: statusBarReducer,
    webView: webViewReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          subscribe.type, // May contain a callback function
          call.type, // May contain a callback function
        ],
      },
    }).concat([ServerMiddleware, AnalysisMiddleware, FilesMiddleware]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
