import React from 'react';
import { ISettingWithValidationProps } from 'models/SettingsEditorProps';

export interface TextEditorProps {
  setting: TextSettingProps;
}

export interface TextSettingProps extends ISettingWithValidationProps<string> {
  type: 'text';
  value?: string;
  placeholder?: string;
}

// TODO: display validation messages
function TextEditor({ setting }: TextEditorProps) {
  return (
    <div>
      <label
        htmlFor="textEditorInput"
        className="form-label form-label-sm visually-hidden"
      >
        {setting.displayName}
      </label>
      <input
        style={{ maxWidth: 500 }}
        onChange={({ target: { value } }) => {
          for (const validator of setting.validators || []) {
            if (!validator.assert(value)) {
              console.error(validator.message(value));
              return;
            }
          }

          setting.onValidChange?.(value);
        }}
        type="text"
        placeholder={setting.placeholder || setting.value}
        defaultValue={setting.value}
        className="form-control form-control-sm"
        id="textEditorInput"
      />
    </div>
  );
}

export default TextEditor;
