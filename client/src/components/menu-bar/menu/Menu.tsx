import React from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import MenuComponent from '../../../components/menu-bar/menu-components/MenuComponent';

function Menu({ t, label, disabled, controls }: any) {
  return (
    <React.Fragment>
      <button
        className="btn btn-sm py-0"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        disabled={disabled}
      >
        {capitalize(t(label || 'menu'))}
      </button>
      <ul className="dropdown-menu small" aria-labelledby="menuDropdown">
        {controls?.map((child: MenuComponent, item: number) => (
          <li key={`${label}-${item}`}>{child}</li>
        ))}
      </ul>
    </React.Fragment>
  );
}

export default withTranslation()(Menu);
