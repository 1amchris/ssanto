import { uniqueId } from 'lodash';
import { ISettingProps } from 'models/SettingsEditorProps';
import React from 'react';

interface CheckboxEditorProps {
  setting: CheckboxSettingProps;
}

interface CheckboxSettingProps extends ISettingProps<boolean> {
  type: 'checkbox';
  checked?: boolean;
}

function CheckboxEditor({ setting }: CheckboxEditorProps) {
  const id = uniqueId('checkbox-');
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        id={id}
        defaultChecked={setting.checked}
        onChange={({ target: { checked } }) => {
          setting.onValidChange?.(checked);
        }}
      />
      <label className="form-check-label small user-select-none" htmlFor={id}>
        {setting.shortDescription}
      </label>
    </div>
  );
}

export default CheckboxEditor;
