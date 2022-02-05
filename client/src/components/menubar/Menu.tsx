import React from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import MenuItemModel from './interfaces/MenuItemModel';
import MenuItem from './MenuItem';

function Menu({ t, options: { name, enabled, options } }: any): JSX.Element {
  return (
    <React.Fragment>
      <button
        className="btn btn-sm py-0"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        disabled={!enabled}
      >
        {capitalize(t(name))}
      </button>
      <ul className="dropdown-menu small" aria-labelledby="navbarDropdown">
        {options
          .map((menuSection: MenuItemModel[]) =>
            menuSection.map((menuItem: MenuItemModel) => (
              <li key={menuItem.name}>
                <MenuItem options={menuItem} />
              </li>
            ))
          )
          .reduce((prev: JSX.Element, curr: JSX.Element, index: number) => [
            prev,
            <li key={`divider-${index}`}>
              <hr className="dropdown-divider small" />
            </li>,
            curr,
          ])
          .flat()}
      </ul>
    </React.Fragment>
  );
}

export default withTranslation()(Menu);
