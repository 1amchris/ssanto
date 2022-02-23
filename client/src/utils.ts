import { Store } from 'redux';
import {
  subscribe,
  SubscriptionModel,
} from './store/middlewares/ServerMiddleware';
import {
  receiveParameterFromServer,
  LoadingValue,
} from './store/reducers/analysis';

export const toObjectWithSnakeCaseKeys = (properties: { [key: string]: any }) =>
  Object.fromEntries(
    Object.entries(properties).map(([key, value]: [string, any]) => [
      toSnakeCase(key),
      value,
    ])
  );

export const toSnakeCase = (value: string) =>
  value.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export const isLoading = (values: LoadingValue<any>[]) =>
  Array.from(values)
    .map(value => value.isLoading)
    .reduce((wasLoading, isLoading) => wasLoading && isLoading);

export const generateSubscriptions = (
  dispatch: (action: any) => void,
  property: string,
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
              receiveParameterFromServer({
                property,
                properties: Object.fromEntries([[target, data]]),
              })
            ),
      } as SubscriptionModel)
    )
  );
