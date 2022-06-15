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

function TextEditor({ setting }: TextEditorProps) {
  const [invalidMessage, setInvalidMessage] = React.useState<
    string | undefined
  >(undefined);

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
              setInvalidMessage(validator.message(value));
              return;
            }
          }

          setInvalidMessage(undefined);
          setting.onValidChange?.(value);
        }}
        type="text"
        placeholder={setting.placeholder || setting.value}
        defaultValue={setting.value}
        className="form-control form-control-sm"
        id="textEditorInput"
      />
      {invalidMessage && (
        <p className="small mb-0 mt-1 text-danger">{invalidMessage}</p>
      )}
    </div>
  );
}

export default TextEditor;
