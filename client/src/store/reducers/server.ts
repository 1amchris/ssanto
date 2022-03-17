import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createActionWithPayloadBuilder } from 'store/redux-toolkit-utils';
import CallModel from 'models/server-coms/CallModel';
import SubscriptionModel from 'models/SubscriptionModel';

export const serverSlice = createSlice({
  name: 'server',
  initialState: null,
  reducers: {
    openConnection: (_, payload: PayloadAction<string | undefined>) => {},
    subscribe: (_, payload: PayloadAction<SubscriptionModel>) => {},
    call: (_, payload: PayloadAction<CallModel>) => {},
    defaultCallSuccess: (_, { payload: data }: PayloadAction<any>) =>
      console.log('server/defaultCallSuccess called with data:', data),
    defaultCallError: (_, { payload: data }: PayloadAction<any>) =>
      console.log('server/defaultCallError called with data:', data),
  },
});

export const defaultCallSuccess = createActionWithPayloadBuilder(
  serverSlice.actions.defaultCallSuccess
);

export const defaultCallError = createActionWithPayloadBuilder(
  serverSlice.actions.defaultCallError
);

export const { openConnection, subscribe, call } = serverSlice.actions;
