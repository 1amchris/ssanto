import React from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import MenuItemModel from '../../models/MenuItemModel';
import MenuItem from './MenuItem';
import MenuModel from '../../models/MenuModel';

interface params {
  t: (str: string) => string;
  options: MenuModel;
}

export default withTranslation()(
  ({ t, options: { name, enabled, options } }: params): JSX.Element => (
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
          .reduce(
            // for some reason, replacing "any" on the
            //  following line shows a generic error
            (prev: JSX.Element[], curr: any, index: number): JSX.Element[] => [
              prev,
              <li key={`divider-${index}`}>
                <hr className="dropdown-divider small" />
              </li>,
              curr,
            ]
          )
          .flat()}
      </ul>
    </React.Fragment>
  )
);
