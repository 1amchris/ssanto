import React, { ReactElement } from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import MenuItemModel from '../../models/MenuItemModel';
import MenuItem from './MenuItem';
import MenuModel from '../../models/MenuModel';

interface params {
  t: (str: string) => string;
  options: MenuModel;
}

function Menu({
  t,
  options: { name, enabled, options },
}: params): ReactElement {
  return (
    <React.Fragment>
      <button
        className="btn btn-sm py-0"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        disabled={!enabled}
      >
        {capitalize(t(name || 'menu'))}
      </button>
      <ul className="dropdown-menu small" aria-labelledby="menuDropdown">
        {options
          .map((menuSection: MenuItemModel[], section: number) =>
            menuSection.map((menuItem: MenuItemModel, item: number) => (
              <li key={`${name}/${section}-${item}`}>
                <MenuItem options={menuItem} />
              </li>
            ))
          )
          .reduce(
            // for some reason, replacing "any" on the
            //  following line shows a generic error
            (
              prev: ReactElement[],
              curr: any,
              index: number
            ): ReactElement[] => [
              prev,
              <li key={`${name}/div-${index}`}>
                <hr className="dropdown-divider small" />
              </li>,
              curr,
            ],
            []
          )
          .flat()}
      </ul>
    </React.Fragment>
  );
}

export default withTranslation()(Menu);
