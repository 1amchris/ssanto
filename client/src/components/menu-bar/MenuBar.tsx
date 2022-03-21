import React from 'react';
import FileContentModel from 'models/file-models/FileContentModel';
import { useAppDispatch } from 'store/hooks';
import { exportData } from 'store/reducers/export';
import { Action, Divider, Import, Link } from './components';
import { call } from 'store/reducers/server';
import Menu from './Menu';
import ServerTargets from 'enums/ServerTargets';
import CallModel from 'models/server-coms/CallModel';

function MenuBar() {
  const dispatch = useAppDispatch();

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
      <Action
        label="save project"
        onClick={() =>
          dispatch(
            call({
              target: ServerTargets.SaveProject,
              onSuccessAction: exportData,
              // TODO: There should probably be an "onErrorAction"
            } as CallModel<void, FileContentModel<string>, void, string, string>)
          )
        }
      />
      <Action
        label="save project as"
        onClick={() =>
          dispatch(
            call({
              target: ServerTargets.SaveProject,
              onSuccessAction: exportData,
              // TODO: There should probably be an "onErrorAction"
            } as CallModel<void, FileContentModel<string>, void, string, string>)
          )
        }
      />
      <Divider />
      <Action
        label="save weights"
        onClick={() =>
          dispatch(
            call({
              target: ServerTargets.SaveWeights,
              onSuccessAction: exportData,
              // TODO: There should probably be an "onErrorAction"
            } as CallModel<void, FileContentModel<string>, void, string, string>)
          )
        }
      />
      <Action
        label="save objectives hierarchy"
        onClick={() =>
          dispatch(
            call({
              target: ServerTargets.SaveObjectiveHierarchy,
              onSuccessAction: exportData,
              // TODO: There should probably be an "onErrorAction"
            } as CallModel<void, FileContentModel<string>, void, string, string>)
          )
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
