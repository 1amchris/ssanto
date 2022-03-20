import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import mapReducer from 'store/reducers/map';
import analysisReducer from 'store/reducers/analysis';
import guideReducer from 'store/reducers/guide';
import ServerMiddleware from 'store/middlewares/ServerMiddleware';
import AnalysisMiddleware from 'store/middlewares/AnalysisMiddleware';
import ExportMiddleware from 'store/middlewares/ExportMiddleware';
import { call, subscribe } from 'store/reducers/server';

export const store = configureStore({
  reducer: {
    analysis: analysisReducer,
    guide: guideReducer,
    map: mapReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          subscribe.type, // May contain a callback function
          call.type, // May contain a callback function
        ],
      },
    }).concat([ServerMiddleware, AnalysisMiddleware, ExportMiddleware]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
