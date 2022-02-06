import React, { ReactElement } from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import MenuActionModel from '../../../models/MenuItemModels/MenuActionModel';

interface params {
  t: (str: string) => string;
  options: MenuActionModel;
}

function MenuActionButton({
  t,
  options: { name, enabled, onActionCalled },
}: params): ReactElement {
  return (
    <button
      className={`small dropdown-item ${
        enabled || enabled === undefined ? '' : 'disabled'
      }`}
      onClick={onActionCalled}
    >
      {capitalize(t(name || 'menu item'))}
    </button>
  );
}

export default withTranslation()(MenuActionButton);
