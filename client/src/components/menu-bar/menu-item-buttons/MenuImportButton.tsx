import React, { ReactElement, createRef, RefObject } from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize, first } from 'lodash';
import { Import } from '../../../models/menu-item-models';

interface params {
  t: (str: string) => string;
  options: Import;
}

const handleFileChanged =
  (onFileChanged: (file: File) => void) =>
  ({ target: { files } }: React.ChangeEvent<HTMLInputElement>) =>
    files && files.length > 0 && onFileChanged(first(files)!);

function MenuImportButton({
  t,
  options: { name, enabled, onFileImported, acceptedExtensions },
}: params): ReactElement {
  const inputRef: RefObject<HTMLInputElement> = createRef();

  return (
    <React.Fragment>
      <input
        ref={inputRef}
        type="file"
        className="visually-hidden"
        accept={acceptedExtensions}
        onChange={handleFileChanged(onFileImported)}
      />
      <button
        className={`small dropdown-item ${
          enabled || enabled === undefined ? '' : 'disabled'
        }`}
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        {capitalize(t(name || 'menu item'))}
      </button>
    </React.Fragment>
  );
}

export default withTranslation()(MenuImportButton);
