import React from 'react';
import FileContentModel from 'models/file/FileContentModel';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { exportData } from 'store/reducers/export';
import { Action, Divider, ImportFolder, Link } from './components';
import { call } from 'store/reducers/server';
import Menu from './Menu';
import ServerCallTarget from 'enums/ServerCallTarget';
import CallModel from 'models/server-coms/CallModel';
import FilesUtils from 'utils/files-utils';
import { selectMap } from 'store/reducers/map';
import { openWorkspace, selectFiles } from 'store/reducers/files';

/**
 * Menu bar component.
 * @param {any} param0 Parameters for the menu bar.
 * @return {JSX.Element} Html.
 */
function MenuBar({ style }: any) {
  const mapLayers = useAppSelector(selectMap).layers;
  const { files } = useAppSelector(selectFiles);
  const dispatch = useAppDispatch();

  const getMenus = () => [
    <Menu key="menu-project" label="project">
      {/* <ImportFile
        key="import-file"
        label="open file"
        accept=".sproj"
        onFileImported={(file: File) => {
          dispatch(resetError());
          FilesUtils.extractContentFromFiles([file]).then(file => {
            dispatch(
              call({
                target: ServerCallTarget.OpenProject,
                args: [file[0].content],
                onSuccessAction: loadingFileComplete,
                onErrorAction: loadingFileComplete,
                // TODO: There should probably be an "onErrorAction"
              } as CallModel<string[], FileContentModel<string>>)
            );
          });
        }}
      /> */}
      <ImportFolder
        key="open-workspace"
        label="open workspace"
        onFolderImported={(files: FileList) =>
          dispatch(
            openWorkspace(
              FilesUtils.extractRootPath(
                Array.from(files).map((f: /* File */ any) => f.path)
              )
            )
          )
        }
      />
      <Action
        key="action"
        label="save project"
        // TODO: It should also account for modifications in files
        disabled={!files || files.length === 0}
        onClick={() =>
          dispatch(
            call({
              target: ServerCallTarget.SaveProject,
              onSuccessAction: exportData,
            } as CallModel<void, FileContentModel<string>>)
          )
        }
      />
      <Action
        key="close-workspace"
        label="close workspace"
        disabled={!files || files.length === 0}
        // TODO: There should probably be a "confirm action" dialog
        onClick={() =>
          dispatch(
            call({
              target: ServerCallTarget.WorkspaceManagerCloseWorkspace,
            } as CallModel)
          )
        }
      />
      <Divider />
      <Action
        key="add-group"
        label="open editor group"
        disabled={!files || files.length === 0}
        onClick={() =>
          dispatch(
            call({
              target: ServerCallTarget.ViewsManagerOpenEditorGroup,
            } as CallModel)
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
              target: ServerCallTarget.ExportTiff,
              args: ['analysis'],
              onSuccessAction: exportData,
              // TODO: There should probably be an "onErrorAction"
            } as CallModel<[string], FileContentModel<string>>)
          )
        }
      />
    </Menu>,
    <Menu key="menu-help" label="help">
      <Link label="show guide" targetUrl="/guide" />
    </Menu>,
  ];

  return (
    <nav
      className="navbar navbar-expand navbar-light border-bottom py-0 small"
      style={style}
    >
      <div className="container-fluid">
        {/* <img
          src="logo192.png"
          alt="SSanto"
          width="20"
          height="20"
          className="d-inline-block align-text-top me-2"
        /> */}
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
