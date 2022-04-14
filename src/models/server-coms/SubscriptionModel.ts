import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { InjectedActionCreatorWithPayload } from 'store/redux-toolkit-utils';

export default interface SubscriptionModel<ReturnType = any, InjectType = any> {
  subject: string;
  onAction:
    | InjectedActionCreatorWithPayload<InjectType, ReturnType>
    | ActionCreatorWithPayload<ReturnType>;
}
