import React from 'react';
import { ISettingWithValidationProps } from 'models/SettingsEditorProps';
import { uniqueId } from 'lodash';

export interface FileEditorProps {
  setting: FileSettingProps;
}

export interface FileSettingProps
  extends ISettingWithValidationProps<FileList | null> {
  type: 'file';
  value?: string;
  accept?: string;
  multiple?: boolean;
}

function FileSelector({ setting }: FileEditorProps) {
  const [invalidMessage, setInvalidMessage] = React.useState<
    string | undefined
  >(undefined);

  const files = ([] as (string | undefined)[]).concat(setting.value);
  const id = uniqueId('file-');
  return (
    <div className="d-flex flex-column">
      <label htmlFor={id} className="form-label form-label-sm visually-hidden">
        {setting.displayName}
      </label>
      {setting.value && (
        <small
          key={`${setting.uri}-${setting.value}`}
          className="text-secondary text-wrap d-flex align-items-center"
        >
          Selected file: {files[0]?.split('/').slice(-1)[0]}
          {files.length > 1 &&
            ` and ${files.length - 1} ${
              files.length - 1 > 1 ? 'others' : 'other'
            }`}
          <a
            onClick={() => setting.onValidChange?.(null)}
            className="btn btn-sm text-danger"
          >
            clear
          </a>
        </small>
      )}
      <input
        accept={setting.accept}
        multiple={setting.multiple}
        disabled={setting.disabled}
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
