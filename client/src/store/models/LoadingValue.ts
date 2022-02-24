import { Value } from './Value';

export interface LoadingValue<ValueType> extends Value<ValueType> {
  isLoading: boolean;
}
