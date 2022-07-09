import React from 'react';
import { ISettingWithValidationProps } from 'models/SettingsEditorProps';
import { uniqueId } from 'lodash';

export interface NumberEditorProps {
  setting: NumberSettingProps;
}

export interface NumberSettingProps
  extends ISettingWithValidationProps<number> {
  type: 'number';
  value?: number;
  placeholder?: string | number;
  min?: number;
  max?: number;
}

function NumberEditor({ setting }: NumberEditorProps) {
  const [invalidMessage, setInvalidMessage] = React.useState<
    string | undefined
  >(undefined);

  const [focused, setFocused] = React.useState(false);

  const id = uniqueId('number-');
  return (
    <div>
      <label htmlFor={id} className="form-label form-label-sm visually-hidden">
        {setting.displayName}
      </label>
      <input
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        key={setting.uri + `${focused ? '' : setting.value}`}
        style={{ maxWidth: 250 }}
        disabled={setting.disabled}
        onChange={({ target: { value } }) => {
          const numberValue = Number(value);
          for (const validator of setting.validators || []) {
            if (!validator.assert(numberValue)) {
              setInvalidMessage(validator.message(numberValue));
              return;
            }
          }

          setInvalidMessage(undefined);
          setting.onValidChange?.(numberValue);
        }}
        type="number"
        placeholder={`${setting.placeholder || setting.value}`}
        defaultValue={setting.value}
        className="form-control form-control-sm"
        id={id}
        min={setting.min}
        max={setting.max}
      />
      {invalidMessage && (
        <p className="small mb-0 mt-1 text-danger">{invalidMessage}</p>
      )}
    </div>
  );
}

export default NumberEditor;
