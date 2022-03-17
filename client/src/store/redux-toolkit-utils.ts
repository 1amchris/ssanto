import { ActionCreatorWithPayload, PayloadAction } from '@reduxjs/toolkit';

// An injected payload is a payload with an binded object
//  (for example when the action has attributes decided ahead of time).
//  e.g: an API call, with a callback in which
export interface InjectedPayload<InjectionType, PayloadType> {
  injected: InjectionType;
  payload: PayloadType;
}

export type InjectableActionCreatorWithPayload<InjectionType, PayloadType> =
  ActionCreatorWithPayload<InjectedPayload<InjectionType, PayloadType>>;

export type InjectedPayloadAction<InjectionType, PayloadType> = PayloadAction<
  InjectedPayload<InjectionType, PayloadType>
>;

export type InjectedActionCreatorWithPayload<InjectionType, PayloadType> = (
  payload: PayloadType
) => InjectedPayloadAction<InjectionType, PayloadType>;

export type ActionCreatorWithPayloadSyringe<InjectionType, PayloadType> = (
  injected: InjectionType
) => InjectedActionCreatorWithPayload<InjectionType, PayloadType>;

// Generates injectable callback-able actions (so they can be passed around)
//  Injecting a function means it can be parameterised before passing it (a kind of higher-order-action)
export function createActionCreatorSyringe<InjectionType, PayloadType>(
  actionCreator: InjectableActionCreatorWithPayload<InjectionType, PayloadType>
): ActionCreatorWithPayloadSyringe<InjectionType, PayloadType> {
  return (
      injected: InjectionType
    ): InjectedActionCreatorWithPayload<InjectionType, PayloadType> =>
    (payload: PayloadType): InjectedPayloadAction<InjectionType, PayloadType> =>
      actionCreator({
        injected,
        payload,
      });
}
