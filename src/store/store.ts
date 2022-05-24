import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import mapReducer from 'store/reducers/map';
import activityBarReducer from 'store/reducers/activity-bar';
import analysisReducer from 'store/reducers/analysis';
import exportReducer from 'store/reducers/export';
import guideReducer from 'store/reducers/guide';
import statusBarReducer from 'store/reducers/status-bar';
import webViewReducer from 'store/reducers/web-view';
import ServerMiddleware from 'store/middlewares/ServerMiddleware';
import AnalysisMiddleware from 'store/middlewares/AnalysisMiddleware';
import { call, subscribe } from 'store/reducers/server';

export const store = configureStore({
  reducer: {
    activityBar: activityBarReducer,
    analysis: analysisReducer,
    export: exportReducer,
    guide: guideReducer,
    map: mapReducer,
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
