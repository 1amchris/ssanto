import React from 'react';
import { ISettingWithValidationProps } from 'models/SettingsEditorProps';

export interface FileEditorProps {
  setting: FileSettingProps;
}

export interface FileSettingProps
  extends ISettingWithValidationProps<FileList | null> {
  type: 'file';
  accept?: string;
  multiple?: boolean;
}

function FileSelector({ setting }: FileEditorProps) {
  return (
    <div>
      <label
        htmlFor="fileSelectorInput"
        className="form-label form-label-sm visually-hidden"
      >
        {setting.displayName}
      </label>
      <input
        accept={setting.accept}
        multiple={setting.multiple}
        style={{ maxWidth: 500 }}
        onChange={({ target: { files } }) => {
          for (const validator of setting.validators || []) {
            if (!validator.assert(files)) {
              console.error(validator.message(files));
              return;
            }
          }

          setting.onValidChange?.(files);
        }}
        type="file"
        className="form-control form-control-sm"
        id="fileSelectorInput"
      />
    </div>
  );
}
export default FileSelector;
