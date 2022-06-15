import ValidatorModel from 'models/ValidatorModel';

export type SettingsEditorType =
  | 'text'
  | 'number'
  | 'checkbox'
  | 'file'
  | 'select';

export interface ISettingProps<T> {
  type: SettingsEditorType;
  uri: string;
  displayName: string;
  shortDescription: string;
  family?: string;
  onValidChange?: (value: T) => void;
}

export interface ISettingWithValidationProps<T> extends ISettingProps<T> {
  validators?: ValidatorModel<T>[];
}
