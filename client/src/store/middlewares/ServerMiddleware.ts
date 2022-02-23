import { createAction, Store } from '@reduxjs/toolkit';
import ServerCom from '@apis/ServerCom';

export interface CallModel {
  target: string;
  args?: any[];
}

export interface SendFilesModel {
  files: FileList;
  target: string;
}

export interface SubscriptionModel {
  subject: string;
  callback: (store: Store) => (data: any) => void;
}

export const openConnection = createAction<string | undefined>('openSocket');
export const call = createAction<CallModel>('call');
export const sendFiles = createAction<SendFilesModel>('sendFiles');
export const subscribe = createAction<SubscriptionModel>('subscribe');

const ServerComMiddleware = () => {
  let serverCom = new ServerCom();
  return (store: any) => (next: any) => (action: any) => {
    switch (action.type) {
      case openConnection.type:
        return serverCom.open(action.payload);

      case sendFiles.type: {
        const { files, target }: SendFilesModel = action.payload;
        return serverCom.sendFiles(files, target);
      }

      case call.type: {
        const { target, args } = action.payload;
        return serverCom.call(target, args || []);
      }

      case subscribe.type:
        const { subject, callback } = action.payload;
        return serverCom.subscribe(subject, callback(store));

      default:
        return next(action);
    }
  };
};

export default ServerComMiddleware();
