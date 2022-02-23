import { Store } from 'redux';
import {
  subscribe,
  SubscriptionModel,
} from './store/middlewares/ServerMiddleware';
import { receiveParameterFromServer, Value } from './store/reducers/analysis';

export const toSnakeProperties = (properties: { [key: string]: any }) =>
  Object.fromEntries(
    Object.entries(properties).map(([key, value]: [string, any]) => [
      toSnakeCase(key),
      value,
    ])
  );

export const toSnakeCase = (value: string) =>
  value.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export const isLoading = (values: Value[]) =>
  Array.from(values)
    .map(value => value.isLoading)
    .reduce((wasLoading, isLoading) => wasLoading && isLoading);

export const generateSubscriptions = (
  dispatch: (action: any) => void,
  subjects: string[]
) =>
  Array.from(subjects).forEach(target =>
    dispatch(
      subscribe({
        subject: toSnakeCase(target),
        callback:
          ({ dispatch }: Store) =>
          (data: any) =>
            dispatch(
              receiveParameterFromServer(Object.fromEntries([[target, data]]))
            ),
      } as SubscriptionModel)
    )
  );
