import ServerCom from 'apis/ServerCom';
import {
  call,
  defaultCallError,
  defaultCallSuccess,
  openConnection,
  subscribe,
} from 'store/reducers/server';
import { Middleware, MiddlewareAPI, Dispatch } from 'redux';
import { PayloadAction } from '@reduxjs/toolkit';
import CallModel from 'models/server-coms/CallModel';
import SubscriptionModel from 'models/server-coms/SubscriptionModel';

const ServerComMiddleware: () => Middleware = () => {
  const serverCom = new ServerCom();
  return ({ dispatch }: MiddlewareAPI) =>
    (next: Dispatch) =>
    <A extends PayloadAction<any>>(action: A) => {
      switch (action.type) {
        case openConnection.type:
          return serverCom.open(action.payload);

        case call.type:
          const {
            target,
            args = [],
            onSuccessAction = defaultCallSuccess,
            onErrorAction = defaultCallError,
          } = action.payload as CallModel;

          return serverCom.call(target, args, (isSuccess: boolean, data: any) =>
            dispatch(isSuccess ? onSuccessAction(data) : onErrorAction(data))
          );

        case subscribe.type:
          const { subject, onAction } = action.payload as SubscriptionModel;

          return serverCom.subscribe(subject, data => dispatch(onAction(data)));

        default:
          return next(action);
      }
    };
};

export default ServerComMiddleware();
