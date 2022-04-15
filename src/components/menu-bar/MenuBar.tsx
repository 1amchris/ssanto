import React from 'react';
import FileContentModel from 'models/file/FileContentModel';
import { useAppDispatch } from 'store/hooks';
import { exportData } from 'store/reducers/export';
import { Action, Divider, Import, Link } from './components';
import { call } from 'store/reducers/server';
import Menu from './Menu';
import ServerCallTargets from 'enums/ServerCallTargets';
import CallModel from 'models/server-coms/CallModel';
import FilesUtils from 'utils/files-utils';
import html2canvas from 'html2canvas';

/**
 * Menu bar component.
 * @param {any} param0 Parameters for the menu bar.
 * @return {JSX.Element} Html.
 */
function MenuBar() {
  const dispatch = useAppDispatch();

  const createTIFF = async () => {
    const element = document.getElementById('map')!;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL('image/tiff');
    const link = document.createElement('a');
    const filename = 'analysis' + Date.now() + '.tiff';

    if (typeof link.download === 'string') {
      link.href = data;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  const getMenus = () => [
    <Menu key="menu-project" label="project">
      <Import
        key="import"
        label="open project"
        accept=".sproj"
        onFileImported={(file: File) =>
          FilesUtils.extractContentFromFiles([file]).then(file =>
            dispatch(
              call({
                target: ServerCallTargets.OpenProject,
                args: [file[0].content],
                // TODO: There should probably be an "onErrorAction"
              } as CallModel<string[], FileContentModel<string>, void, string, string>)
            )
          )
        }
      />
      <Action
        key="action"
        label="save project"
        onClick={() =>
          dispatch(
            call({
              target: ServerCallTargets.SaveProject,
              onSuccessAction: exportData,
              // TODO: There should probably be an "onErrorAction"
            } as CallModel<void, FileContentModel<string>, void, string, string>)
          )
        }
      />
      <Divider />
      <Action
        label="Export analysis as .TIFF"
        onClick={(event: any) => {
          createTIFF();
          console.log('analysis.tiff', event);
        }}
      />
    </Menu>,
    <Menu key="menu-help" label="help">
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
