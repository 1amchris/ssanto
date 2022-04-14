import React from 'react';
import FileContentModel from 'models/file/FileContentModel';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { exportData } from 'store/reducers/export';
import { Action, Divider, Import, Link } from './components';
import { call } from 'store/reducers/server';
import Menu from './Menu';
import ServerCallTargets from 'enums/ServerCallTargets';
import CallModel from 'models/server-coms/CallModel';
import FilesUtils from 'utils/files-utils';
import { selectMap } from 'store/reducers/map';

function MenuBar() {
  const mapLayers = useAppSelector(selectMap).layers;
  const dispatch = useAppDispatch();

  const getMenus = () => [
    <Menu label="project">
      <Import
        label="open project"
        accept=".sproj"
        onFileImported={(file: File) =>
          FilesUtils.extractContentFromFiles([file]).then(file =>
            dispatch(
              call({
                target: ServerCallTargets.OpenProject,
                args: [file[0].content],
                // TODO: There should probably be an "onErrorAction"
              } as CallModel<string[], FileContentModel<string>>)
            )
          )
        }
      />
      <Action
        label="save project"
        onClick={() =>
          dispatch(
            call({
              target: ServerCallTargets.SaveProject,
              onSuccessAction: exportData,
              // TODO: There should probably be an "onErrorAction"
            } as CallModel<void, FileContentModel<string>>)
          )
        }
      />
      <Divider />
      <Action
        label="export analysis as tiff"
        disabled={
          !(
            mapLayers?.analysis &&
            mapLayers?.analysis['current analysis'] !== undefined
          )
        }
        onClick={() =>
          dispatch(
            call({
              target: ServerCallTargets.ExportTiff,
              args: ['analysis'],
              onSuccessAction: exportData,
              // TODO: There should probably be an "onErrorAction"
            } as CallModel<[string], FileContentModel<string>>)
          )
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
