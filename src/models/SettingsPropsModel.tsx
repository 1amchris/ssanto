import ValidatorModel from 'models/ValidatorModel';

export type SettingsEditorType =
  | 'text'
  | 'number'
  | 'checkbox'
  | 'file'
  | 'select';

export interface ISettingProps {
  type: SettingsEditorType;
  uri: string;
  displayName: string;
  family?: string;
  shortDescription: string;
}

export interface ISettingWithValidationProps<T> extends ISettingProps {
  validators: ValidatorModel<T>[];
}
