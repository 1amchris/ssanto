import { createAction } from '@reduxjs/toolkit';
import ServerCom from '../../apis/ServerCom';
import { RootState } from '../store';

export interface callFunctionModel {
  functionName: string;
  [arg: string]: any;
}

export interface callMethodModel {
  instanceName: string;
  methodName: string;
  [arg: string]: any;
}

export interface SubscriptionModel {
  subjectId: string;
  callback: (store: RootState) => (data: any) => void;
}

export const openConnection = createAction<string | undefined>('openSocket');
export const callFunction = createAction<callFunctionModel>('callFunction');
export const callMethod = createAction<callMethodModel>('callMethod');
export const sendFile = createAction<File>('sendFile');
export const subscribe = createAction<SubscriptionModel>('subscribe');

const ServerComMiddleware = () => {
  let serverCom = new ServerCom();
  return (store: any) => (next: any) => (action: any) => {
    switch (action.type) {
      case openConnection.type:
        return serverCom.open(action.payload);

      case sendFile.type:
        return serverCom.sendFile(action.payload);

      case callFunction.type:
        const { functionName, ...functionArgs } = action.payload;
        return serverCom.callFunction(functionName);

      case callMethod.type:
        const { instanceName, methodName, ...methodArgs } = action.payload;
        return serverCom.callMethod(instanceName, methodName);

      case subscribe.type:
        const { subjectId, callback } = action.payload;
        return serverCom.subscribe(subjectId, callback(store));

      default:
        return next(action);
    }
  };
};

export default ServerComMiddleware();
