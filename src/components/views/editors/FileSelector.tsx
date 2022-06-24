import React from 'react';
import { ISettingWithValidationProps } from 'models/SettingsEditorProps';
import { uniqueId } from 'lodash';

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
  const [invalidMessage, setInvalidMessage] = React.useState<
    string | undefined
  >(undefined);

  const id = uniqueId('file-');
  return (
    <div>
      <label htmlFor={id} className="form-label form-label-sm visually-hidden">
        {setting.displayName}
      </label>
      <input
        accept={setting.accept}
        multiple={setting.multiple}
        style={{ maxWidth: 500 }}
        onChange={({ target: { files } }) => {
          for (const validator of setting.validators || []) {
            if (!validator.assert(files)) {
              setInvalidMessage(validator.message(files));
              return;
            }
          }

          setInvalidMessage(undefined);
          setting.onValidChange?.(files);
        }}
        type="file"
        className="form-control form-control-sm"
        id={id}
      />
      {invalidMessage && (
        <p className="small mb-0 mt-1 text-danger">{invalidMessage}</p>
      )}
    </div>
  );
}
export default FileSelector;
