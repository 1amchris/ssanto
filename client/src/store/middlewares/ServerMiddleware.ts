import { createAction, Store } from '@reduxjs/toolkit';
import ServerCom from 'apis/ServerCom';
import {
  defaultCallError,
  defaultCallSuccess,
  receiveProperties,
} from 'store/reducers/analysis';

export interface CallModel {
  target: string;
  args?: any[];
  successAction?: any;
  successData?: any;
  failureAction?: any;
  failureData?: any;
}

export interface SendFilesModel {
  files: FileList;
  target: string;
}

export interface SubscriptionModel {
  subject: string;
}

export interface AskDataModel {
  dataType: string;
}

export const openConnection = createAction<string | undefined>('openSocket');
export const call = createAction<CallModel>('call');
export const sendFiles = createAction<SendFilesModel>('sendFiles');
export const subscribe = createAction<SubscriptionModel>('subscribe');
export const askData = createAction<AskDataModel>('askData');

const ServerComMiddleware = () => {
  let serverCom = new ServerCom();
  return (store: any) => (next: any) => (action: any) => {
    switch (action.type) {
      case openConnection.type: {
        return serverCom.open(action.payload);
      }

      case call.type: {
        const { target, args, successData, failureData } = action.payload;
        let { successAction, failureAction } = action.payload;
        if (successAction === undefined) successAction = defaultCallSuccess;
        if (failureAction === undefined) failureAction = defaultCallError;
        return serverCom.call(
          target,
          args || [],
          (({ dispatch }: Store) =>
            (isSuccess: boolean, data: any) => {
              if (isSuccess)
                dispatch(successAction({ params: successData, data: data }));
              else dispatch(failureAction({ params: failureData, data: data }));
            }).call(null, store)
        );
      }

      case subscribe.type: {
        const { subject } = action.payload;
        return serverCom.subscribe(
          subject,
          (({ dispatch }: Store) =>
            (data: any) =>
              dispatch(
                receiveProperties({ property: subject, data: data })
              )).call(null, store)
        );
      }

      default:
        return next(action);
    }
  };
};

export default ServerComMiddleware();
