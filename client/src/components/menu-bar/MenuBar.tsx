import React from 'react';
import { Action, Divider, Export, Import, Link } from './menu-components';
import Menu from './menu/Menu';

function MenuBar() {
  const getMenus = () => [
    <Menu label="project">
      <Action
        label="new project"
        onClick={(event: any) => console.log('/file/new project', event)}
      />
      <Import
        label="open project"
        onFileImported={(file: File) => console.log('/file/open project', file)}
      />
      <Divider />
      <Export
        label="save project"
        getExportedFile={() =>
          new File(['Hello, world!'], 'hello world.txt', {
            type: 'text/plain;charset=utf-8',
          })
        }
      />
    </Menu>,
    <Menu label="edit">
      <Action
        label="action"
        onClick={(event: any) => console.log('/edit/action', event)}
      />
      <Action
        label="another action"
        onClick={(event: any) => console.log('/edit/another action', event)}
      />
      <Divider />
      <Action
        label="something else here"
        onClick={(event: any) =>
          console.log('/edit/something else here', event)
        }
      />
    </Menu>,
    <Menu label="help">
      <Link label="show guide" targetUrl="/guide" />
    </Menu>,
  ];

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
          {getMenus()?.map((menu, index: number) => (
            <li className="nav-item dropdown" key={`menubar/menu-${index}`}>
              {menu}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default MenuBar;
