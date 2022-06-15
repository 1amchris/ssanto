import { ISettingProps } from 'models/SettingsPropsModel';
import React from 'react';

interface CheckboxEditorProps {
  setting: CheckboxSettingProps;
}

interface CheckboxSettingProps extends ISettingProps {
  type: 'checkbox';
  checked?: boolean;
}

function CheckboxEditor({ setting }: CheckboxEditorProps) {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        id="checkboxEditorInput"
        defaultChecked={setting.checked}
      />
      <label
        className="form-check-label small user-select-none"
        htmlFor="checkboxEditorInput"
      >
        {setting.shortDescription}
      </label>
    </div>
  );
}

export default CheckboxEditor;
