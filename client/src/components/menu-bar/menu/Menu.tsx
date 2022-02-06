import React, { ReactElement } from 'react';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import MenuItemModel from '../../../models/MenuItemModel';
import MenuActionModel from '../../../models/MenuActionModel';
import MenuImportModel from '../../../models/MenuImportModel';
import MenuExportModel from '../../../models/MenuExportModel';
import MenuActionButton from '../menu-item/MenuActionButton';
import MenuModel from '../../../models/MenuModel';
import MenuExportButton from '../menu-item/MenuExportButton';
import MenuImportButton from '../menu-item/MenuImportButton';

interface params {
  t: (str: string) => string;
  options: MenuModel;
}

// TODO: There's probably a better way of doing that, I just can't figure it out right now.
const menus = new Map<string, (payload: MenuItemModel) => ReactElement>();
menus.set('action', (payload: MenuItemModel) => (
  <MenuActionButton options={payload as MenuActionModel} />
));
menus.set('import', (payload: MenuItemModel) => (
  <MenuImportButton options={payload as MenuImportModel} />
));
menus.set('export', (payload: MenuItemModel) => (
  <MenuExportButton options={payload as MenuExportModel} />
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
            .map((menuSection: MenuItemModel[], section: number) =>
              menuSection
                .filter(({ type }) => menus.has(type))
                .map((menuItem: MenuItemModel, item: number) => (
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
