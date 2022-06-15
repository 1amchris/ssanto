import { ISettingWithValidationProps } from 'models/SettingsPropsModel';
import React from 'react';

interface SelectEditorProps {
  setting: SelectSettingProps;
}

interface SelectSettingProps extends ISettingWithValidationProps<string> {
  type: 'select';
  value?: string;
  options: SelectOptionProps[];
}

export interface SelectOptionProps {
  uri: string;
  displayName: string;
  shortDescription: string;
}

function SelectEditor({ setting }: SelectEditorProps) {
  return (
    <div>
      <label
        htmlFor="selectEditorInput"
        className="form-label form-label-sm visually-hidden"
      >
        {setting.displayName}
      </label>
      <select
        className="form-select form-select-sm"
        id="selectEditorInput"
        defaultValue={setting.value}
        style={{ maxWidth: 400 }}
        onChange={({ target: { value } }) => {
          for (const validator of setting.validators || []) {
            if (!validator.assert(value)) {
              console.error(validator.message(value));
              return;
            }
          }
        }}
      >
        {setting.options.map((option: SelectOptionProps) => (
          <option key={option.uri} value={option.uri}>
            {option.displayName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectEditor;
