import ValidatorModel from 'models/ValidatorModel';

export type SettingsEditorType =
  | 'checkbox'
  | 'date'
  | 'file'
  | 'number'
  | 'select'
  | 'text';

export interface ISettingProps<T> {
  type: SettingsEditorType;
  uri: string;
  displayName: string;
  shortDescription: string;
  family?: string;
  disabled?: boolean;
  onValidChange?: (value: T) => void;
}

export interface ISettingWithValidationProps<T> extends ISettingProps<T> {
  validators?: ValidatorModel<T>[];
}
