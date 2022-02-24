import { Store } from 'redux';
import {
  subscribe,
  SubscriptionModel,
} from 'store/middlewares/ServerMiddleware';
import { receiveProperties } from 'store/reducers/analysis';
import { LoadingValue } from 'store/models/LoadingValue';
import { Value } from 'store/models/Value';

// Converts an object's keys from camelCase to snake_cases
export const toObjectWithSnakeCaseKeys = (properties: { [key: string]: any }) =>
  Object.fromEntries(
    Object.entries(properties).map(([key, value]: [string, any]) => [
      toSnakeCase(key),
      value,
    ])
  );

// Converts a camelCase into a snake_case string
export const toSnakeCase = (value: string) =>
  value.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

// Returns only unique errors
export const getErrors = (values: Value<any>[]) =>
  Array.from(values)
    .map((value: any) => value.error)
    .filter(
      (error: any, index: number, self: any[]) =>
        error && self.indexOf(error) === index
    );

// Returns true if any of the LoadingValues are still loading, false otherwise
export const isLoading = (values: LoadingValue<any>[]) =>
  Array.from(values)
    .map(value => value.isLoading)
    .reduce((wasLoading, isLoading) => wasLoading && isLoading);

// Subscribes to the server's variables who's
// name matches a subject for the corresponding property
export const generateSubscriptions = (
  dispatch: (action: any) => void,
  property: string,
  subjects: string[]
) =>
  Array.from(subjects).forEach(target =>
    dispatch(
      subscribe({
        subject: toSnakeCase(`${property}.${target}`),
        callback:
          ({ dispatch }: Store) =>
          (data: any) =>
            dispatch(
              receiveProperties({
                property,
                properties: Object.fromEntries([[target, data]]),
              })
            ),
      } as SubscriptionModel)
    )
  );
