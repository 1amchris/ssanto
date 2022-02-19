import { createAction, Store } from '@reduxjs/toolkit';
import ServerCom from '../../apis/ServerCom';

export interface CallFunctionModel {
  functionName: string;
  [arg: string]: any;
}

export interface CallMethodModel {
  instanceName: string;
  methodName: string;
  [arg: string]: any;
}

export interface SendFilesModel {
  files: FileList;
  command?: string;
}

export interface SubscriptionModel {
  subjectId: string;
  callback: (store: Store) => (data: any) => void;
}

export const openConnection = createAction<string | undefined>('openSocket');
export const callFunction = createAction<CallFunctionModel>('callFunction');
export const callMethod = createAction<CallMethodModel>('callMethod');
export const sendFiles = createAction<SendFilesModel>('sendFiles');
export const subscribe = createAction<SubscriptionModel>('subscribe');

const ServerComMiddleware = () => {
  let serverCom = new ServerCom();
  return (store: any) => (next: any) => (action: any) => {
    switch (action.type) {
      case openConnection.type:
        return serverCom.open(action.payload);

      case sendFiles.type:
        const { files, command }: SendFilesModel = action.payload;
        return serverCom.sendFiles(files, command || 'file');

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
