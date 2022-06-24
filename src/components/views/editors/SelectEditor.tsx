import { uniqueId } from 'lodash';
import { ISettingWithValidationProps } from 'models/SettingsEditorProps';
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
  const [invalidMessage, setInvalidMessage] = React.useState<
    string | undefined
  >(undefined);

  const id = uniqueId('select-');
  return (
    <div>
      <label htmlFor={id} className="form-label form-label-sm visually-hidden">
        {setting.displayName}
      </label>
      <select
        className="form-select form-select-sm"
        id={id}
        defaultValue={setting.value}
        style={{ maxWidth: 400 }}
        onChange={({ target: { value } }) => {
          for (const validator of setting.validators || []) {
            if (!validator.assert(value)) {
              setInvalidMessage(validator.message(value));
              return;
            }
          }

          setInvalidMessage(undefined);
          setting.onValidChange?.(value);
        }}
      >
        {setting.options.map((option: SelectOptionProps) => (
          <option key={option.uri} value={option.uri}>
            {option.displayName}
          </option>
        ))}
      </select>
      {invalidMessage && (
        <p className="small mb-0 mt-1 text-danger">{invalidMessage}</p>
      )}
    </div>
  );
}

export default SelectEditor;
