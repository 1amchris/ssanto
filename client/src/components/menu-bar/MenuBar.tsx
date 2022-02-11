import React from 'react';
import Menu from './menu/Menu';
import { Action, Divider, Export, Import, Navigation } from './menu-components';

const menus = [
  {
    label: 'file',
    disabled: false,
    controls: [
      <Action
        label="new file"
        onClick={(event: any) => console.log('/file/new file', event)}
      />,
      <Action
        label="new window"
        onClick={(event: any) => console.log('/file/new window', event)}
      />,
      <Divider />,
      <Import
        label="open project"
        onFileImported={(file: File) => console.log('/file/open project', file)}
      />,
      <Export
        label="save project"
        getExportedFile={() =>
          new File(['Hello, world!'], 'hello world.txt', {
            type: 'text/plain;charset=utf-8',
          })
        }
      />,
    ],
  },
  {
    label: 'edit',
    disabled: true,
    controls: [
      <Action
        label="action"
        onClick={(event: any) => console.log('/edit/action', event)}
      />,
      <Action
        label="another action"
        onClick={(event: any) => console.log('/edit/another action', event)}
      />,
      <Divider />,
      <Action
        label="something else here"
        onClick={(event: any) =>
          console.log('/edit/something else here', event)
        }
      />,
    ],
  },
  {
    label: 'help',
    disabled: false,
    controls: [<Navigation label="show guide" targetUrl="/guide" />],
  },
];

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
          {menus.map((menu: any, index: number) => (
            <li className="nav-item dropdown" key={`menu/li-${index}`}>
              <Menu {...menu} />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default MenuBar;
