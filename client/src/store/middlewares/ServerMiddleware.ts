import { createAction, Store } from '@reduxjs/toolkit';
import ServerCom from 'apis/ServerCom';

export interface CallModel {
  target: string;
  args?: any[];
}

export interface SendFilesModel {
  files: FileList;
  target: string;
}

export type StoreHOF = (store: Store) => (data: any) => void;

export interface SubscriptionModel {
  subject: string;
  callback: StoreHOF;
}

export const openConnection = createAction<string | undefined>('openSocket');
export const call = createAction<CallModel>('call');
export const sendFiles = createAction<SendFilesModel>('sendFiles');
export const subscribe = createAction<SubscriptionModel>('subscribe');

const ServerComMiddleware = () => {
  let serverCom = new ServerCom();
  return (store: any) => (next: any) => (action: any) => {
    switch (action.type) {
      case openConnection.type: {
        return serverCom.open(action.payload);
      }

      case call.type: {
        const { target, args } = action.payload;
        return serverCom.call(target, args || []);
      }

      case subscribe.type: {
        const { subject, callback } = action.payload;
        return serverCom.subscribe(subject, callback(store));
      }

      default:
        return next(action);
    }
  };
};

export default ServerComMiddleware();
