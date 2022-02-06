import React, { ReactElement } from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import MenuItem, * as MenuItems from '../../../models/menu-item-models';
import MenuModel from '../../../models/MenuModel';
import * as MenuButtons from '../menu-item-buttons';

interface params {
  t: (str: string) => string;
  options: MenuModel;
}

// TODO: There's probably a better way of doing that, I just can't figure it out right now.
const menus = new Map<string, (payload: MenuItem) => ReactElement>();
menus.set('action', (payload: MenuItem) => (
  <MenuButtons.Action options={payload as MenuItems.Action} />
));
menus.set('import', (payload: MenuItem) => (
  <MenuButtons.Import options={payload as MenuItems.Import} />
));
menus.set('export', (payload: MenuItem) => (
  <MenuButtons.Export options={payload as MenuItems.Export} />
));

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
        {options.length > 0 &&
          options
            .map((menuSection: MenuItem[], section: number) =>
              menuSection
                .filter(({ type }) => menus.has(type))
                .map((menuItem: MenuItem, item: number) => (
                  <li key={`${name}/${section}-${item}`}>
                    {menus.get(menuItem.type)!(menuItem)}
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
              ]
            )}
      </ul>
    </React.Fragment>
  );
}

export default withTranslation()(Menu);
