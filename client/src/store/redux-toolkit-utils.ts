import { ActionCreatorWithPayload, PayloadAction } from '@reduxjs/toolkit';

// An injected payload is a payload with an binded object
//  (for example when the action has attributes decided ahead of time).
//  e.g: an API call, with a callback in which
export interface InjectedPayload<InjectionType, PayloadType> {
  injected: InjectionType;
  payload: PayloadType;
}

export type ActionCreatorWithInjection<InjectionType, PayloadType> =
  ActionCreatorWithPayload<InjectedPayload<InjectionType, PayloadType>>;

export type InjectedPayloadAction<InjectionType, PayloadType> = PayloadAction<
  InjectedPayload<InjectionType, PayloadType>
>;

export type InjectedActionCreatorWithPayloadBuilder<
  InjectionType,
  PayloadType
> = (payload: PayloadType) => InjectedPayloadAction<InjectionType, PayloadType>;

export type ActionCreatorWithInjectionBuilder<InjectionType, PayloadType> = (
  injected: InjectionType
) => InjectedActionCreatorWithPayloadBuilder<InjectionType, PayloadType>;

// Generates injectable callback-able actions (so they can be passed around)
//  Injecting a function means it can be parameterised before passing it
export function createActionWithInjectionBuilder<InjectionType, PayloadType>(
  actionCreator: ActionCreatorWithInjection<InjectionType, PayloadType>
): ActionCreatorWithInjectionBuilder<InjectionType, PayloadType> {
  return (
      injected: InjectionType
    ): InjectedActionCreatorWithPayloadBuilder<InjectionType, PayloadType> =>
    (payload: PayloadType): InjectedPayloadAction<InjectionType, PayloadType> =>
      actionCreator({
        injected,
        payload,
      });
}

export type ActionCreatorWithPayloadBuilder<PayloadType> = (
  payload: PayloadType
) => PayloadAction<PayloadType>;

// Generates callback-able actions (so they can be passed around)
export function createActionWithPayloadBuilder<PayloadType>(
  actionCreator: ActionCreatorWithPayload<PayloadType>
): ActionCreatorWithPayloadBuilder<PayloadType> {
  return (payload: PayloadType): PayloadAction<PayloadType> =>
    actionCreator(payload);
}
