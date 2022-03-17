import {
  ActionCreatorWithPayloadBuilder,
  InjectedActionCreatorWithPayloadBuilder,
} from 'store/redux-toolkit-utils';

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
    | InjectedActionCreatorWithPayloadBuilder<InjectSuccessType, ReturnType>
    | ActionCreatorWithPayloadBuilder<ReturnType>;
  onErrorAction?:
    | InjectedActionCreatorWithPayloadBuilder<InjectErrorType, ErrorType>
    | ActionCreatorWithPayloadBuilder<ErrorType>;
}
