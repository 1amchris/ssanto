import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from './reducers/counter';
import mapReducer from './reducers/map';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
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
