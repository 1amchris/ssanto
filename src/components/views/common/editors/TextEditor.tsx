import React from 'react';
import { ISettingWithValidationProps } from 'models/SettingsEditorProps';
import { uniqueId } from 'lodash';

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

  const [focused, setFocused] = React.useState(false);

  const id = uniqueId('text-');
  return (
    <div>
      <label htmlFor={id} className="form-label form-label-sm visually-hidden">
        {setting.displayName}
      </label>
      <input
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        key={setting.uri + `${focused ? '' : setting.value}`}
        style={{ maxWidth: 500 }}
        autoFocus={focused}
        disabled={setting.disabled}
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
        id={id}
      />
      {invalidMessage && (
        <p className="small mb-0 mt-1 text-danger">{invalidMessage}</p>
      )}
    </div>
  );
}

export default TextEditor;
