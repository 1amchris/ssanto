import React from 'react';
import { withTranslation } from 'react-i18next';
import MenuModel from './interfaces/MenuModel';
import MenuItemModel from './interfaces/MenuItemModel';
import Menu from './Menu';

function MenuBar({ t }: any): JSX.Element {
  const menus = [
    {
      name: 'file',
      enabled: true,
      options: [
        [
          {
            name: 'new file',
            enabled: true,
            action: (event: any) => console.log('/file/new file', event),
          } as MenuItemModel,
          {
            name: 'new window',
            enabled: false,
            action: (event: any) => console.log('/file/new window', event),
          } as MenuItemModel,
        ],
        [
          {
            name: 'open project',
            enabled: true,
            action: (event: any) => console.log('/file/open project', event),
          } as MenuItemModel,
        ],
      ],
    },
    {
      name: 'edit',
      enabled: true,
      options: [
        [
          {
            name: 'action',
            enabled: false,
            action: (event: any) => console.log('/edit/action', event),
          } as MenuItemModel,
          {
            name: 'another action',
            enabled: false,
            action: (event: any) => console.log('/edit/another action', event),
          } as MenuItemModel,
        ],
        [
          {
            name: 'something else here',
            enabled: true,
            action: (event: any) =>
              console.log('/edit/something else here', event),
          } as MenuItemModel,
        ],
      ],
    },
    {
      name: 'help',
      enabled: true,
      options: [
        [
          {
            name: 'show guide',
            enabled: true,
            action: (event: any) => console.log('/guide', event),
          } as MenuItemModel,
        ],
      ],
    },
  ];

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
            {menus.map((menu: MenuModel) => (
              <li className="nav-item dropdown" key={menu.name}>
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
