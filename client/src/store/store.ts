import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from './reducers/counter';
import mapReducer from './reducers/map';
import analysisReducer from './reducers/analysis';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    analysis: analysisReducer,
    map: mapReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
