import React, { ReactElement } from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import { Navigation } from '../../../models/menu-item-models';
import { Link } from 'react-router-dom';

interface params {
  t: (str: string) => string;
  options: Navigation;
}

function MenuNavigationButton({
  t,
  options: { name, enabled, target },
}: params): ReactElement {
  return (
    <Link
      to={target}
      className={`small dropdown-item ${
        enabled || enabled === undefined ? '' : 'disabled'
      }`}
    >
      {capitalize(t(name || 'menu item'))}
    </Link>
  );
}

export default withTranslation()(MenuNavigationButton);
