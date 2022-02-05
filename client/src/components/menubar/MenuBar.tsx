import React, { ReactElement } from 'react';
import { withTranslation } from 'react-i18next';
import MenuModel from '../../models/MenuModel';
import Menu from './Menu';
import menus from '../../constants/menus';

interface params {
  t: (str: string) => string;
}

function MenuBar({ t }: params): ReactElement {
  return (
    <nav className="navbar navbar-expand navbar-light border-bottom py-0 small">
      <div className="container-fluid">
        <div className="collapse navbar-collapse">
          <img
            src="logo192.png"
            alt="SSanto"
            width="20"
            height="20"
            className="d-inline-block align-text-top me-2"
          />
          <ul className="navbar-nav me-auto">
            {menus.map((menu: MenuModel, index: number) => (
              <li className="nav-item dropdown" key={`menu/${index}`}>
                <Menu options={menu} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default withTranslation()(MenuBar);