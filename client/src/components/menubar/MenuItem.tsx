import React from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import MenuItemModel from '../../models/MenuItemModel';

interface params {
  t: (str: string) => string;
  options: MenuItemModel;
}

export default withTranslation()(
  ({ t, options: { name, enabled, action } }: params): JSX.Element => (
    <button
      className={`small dropdown-item ${enabled || 'disabled'}`}
      onClick={action}
    >
      {capitalize(t(name))}
    </button>
  )
);
