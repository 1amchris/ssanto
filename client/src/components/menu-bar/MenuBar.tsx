import React from 'react';
import MenuModel from '../../models/MenuModel';
import Menu from './menu/Menu';
import menus from '../../constants/menus';

function MenuBar() {
  return (
    <nav
      className="navbar navbar-expand navbar-light border-bottom py-0 small"
      style={{ height: '24px' }}
    >
      <div className="container-fluid">
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
    </nav>
  );
}

export default MenuBar;
