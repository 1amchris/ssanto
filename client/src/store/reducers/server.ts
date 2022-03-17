import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import CallModel from 'models/server-coms/CallModel';
import SubscriptionModel from 'models/SubscriptionModel';

export const serverSlice = createSlice({
  name: 'server',
  initialState: null,
  reducers: {
    openConnection: (_, __: PayloadAction<string | undefined>) => {},
    subscribe: (_, __: PayloadAction<SubscriptionModel>) => {},
    call: (_, __: PayloadAction<CallModel>) => {},
    defaultCallSuccess: (_, { payload: data }: PayloadAction<any>) => {
      console.log('server/defaultCallSuccess called with data:', data);
    },
    defaultCallError: (_, { payload: data }: PayloadAction<any>) => {
      console.log('server/defaultCallError called with data:', data);
    },
  },
});

export const {
  openConnection,
  subscribe,
  call,
  defaultCallError,
  defaultCallSuccess,
} = serverSlice.actions;
