import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { InjectedActionCreatorWithPayload } from 'store/redux-toolkit-utils';

export default interface CallModel<
  ArgsType = any,
  ReturnType = any,
  InjectSuccessType = any,
  ErrorType = any,
  InjectErrorType = any
> {
  target: string;
  args?: ArgsType;
  onSuccessAction?:
    | InjectedActionCreatorWithPayload<InjectSuccessType, ReturnType>
    | ActionCreatorWithPayload<ReturnType>;
  onErrorAction?:
    | InjectedActionCreatorWithPayload<InjectErrorType, ErrorType>
    | ActionCreatorWithPayload<ErrorType>;
}
