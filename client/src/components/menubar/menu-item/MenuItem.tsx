import React, { ReactElement } from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import MenuItemModel from '../../models/MenuItemModel';

interface params {
  t: (str: string) => string;
  options: MenuItemModel;
}

function MenuItem({
  t,
  options: { name, enabled, action },
}: params): ReactElement {
  return (
    <button
      className={`small dropdown-item ${
        enabled || enabled === undefined ? '' : 'disabled'
      }`}
      onClick={action}
    >
      {capitalize(t(name || 'menu item'))}
    </button>
  );
}

export default withTranslation()(MenuItem);
