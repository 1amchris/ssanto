import React from 'react';
import { ISettingWithValidationProps } from 'models/SettingsEditorProps';

export interface NumberEditorProps {
  setting: NumberSettingProps;
}

export interface NumberSettingProps
  extends ISettingWithValidationProps<number> {
  type: 'number';
  value?: number;
  placeholder?: string | number;
}

// TODO: display validation messages
function NumberEditor({ setting }: NumberEditorProps) {
  return (
    <div>
      <label
        htmlFor="numberEditorInput"
        className="form-label form-label-sm visually-hidden"
      >
        {setting.displayName}
      </label>
      <input
        style={{ maxWidth: 250 }}
        onChange={({ target: { value } }) => {
          const numberValue = Number(value);
          for (const validator of setting.validators || []) {
            if (!validator.assert(numberValue)) {
              console.error(validator.message(numberValue));
              return;
            }
          }

          setting.onValidChange?.(numberValue);
        }}
        type="number"
        placeholder={`${setting.placeholder || setting.value}`}
        defaultValue={setting.value}
        className="form-control form-control-sm"
        id="numberEditorInput"
      />
    </div>
  );
}

export default NumberEditor;
