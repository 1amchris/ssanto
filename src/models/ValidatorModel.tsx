export default interface ValidatorModel<T> {
  assert: (value: T) => boolean;
  message: (value: T) => string;
}
