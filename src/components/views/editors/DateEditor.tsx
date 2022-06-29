import React from 'react';
import { ISettingWithValidationProps } from 'models/SettingsEditorProps';
import { uniqueId } from 'lodash';

export interface DateEditorProps {
  setting: DateSettingProps;
}

export interface DateSettingProps extends ISettingWithValidationProps<string> {
  type: 'date';
  value?: string;
  min?: string;
  max?: string;
}

function DateEditor({ setting }: DateEditorProps) {
  const [invalidMessage, setInvalidMessage] = React.useState<
    string | undefined
  >(undefined);

  const [focused, setFocused] = React.useState(false);

  const id = uniqueId('date-');
  return (
    <div>
      <label htmlFor={id} className="form-label form-label-sm visually-hidden">
        {setting.displayName}
      </label>
      <input
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        key={setting.uri + `${focused ? '' : setting.value}`}
        style={{ maxWidth: 150 }}
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
        type="date"
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

export default DateEditor;
