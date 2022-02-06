import React, { ReactElement } from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import { saveAs } from 'file-saver';
import { Export } from '../../../models/menu-item-models';

interface params {
  t: (str: string) => string;
  options: Export;
}

function MenuExportButton({
  t,
  options: { name, enabled, getExportedFile },
}: params): ReactElement {
  return (
    <button
      className={`small dropdown-item ${
        enabled || enabled === undefined ? '' : 'disabled'
      }`}
      onClick={() => {
        const file: File = getExportedFile();
        saveAs(file, file.name);
      }}
    >
      {capitalize(t(name || 'menu item'))}
    </button>
  );
}

export default withTranslation()(MenuExportButton);
