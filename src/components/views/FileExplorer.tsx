import React, { MouseEvent } from 'react';
import { BsTextLeft } from 'react-icons/bs';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectFiles, setFileSelection, setFocus } from 'store/reducers/files';
import FileMetadataModel from 'models/file/FileMetadataModel';
import FolderMetadataModel from 'models/file/FolderMetadataModel';
import NoWorkspaceSelected from 'components/views/NoWorkspaceSelected';
import TreeView from 'components/common/TreeView';
import FilesUtils from 'utils/files-utils';
import ServerCallTarget from 'enums/ServerCallTarget';
import CallModel from 'models/server-coms/CallModel';
import { call } from 'store/reducers/server';

function FileRow({ name }: any) {
  return (
    <div className="w-100 px-2 text-truncate">
      <BsTextLeft /> {name}
    </div>
  );
}

/**
 * File explorer component.
 * Used to visualize and manipulate the system's files.
 * @return {JSX.Element} Html.
 */
function FileExplorer({ style }: any) {
  const dispatch = useAppDispatch();
  const { files, fileSelection, focusedFile } = useAppSelector(selectFiles);

  return (
    <div
      className="w-100 h-100"
      style={{
        ...style,
        fontSize: '10pt',
      }}
    >
      {!files?.length && <NoWorkspaceSelected />}
      {files?.length > 0 && (
        <TreeView
          indentationLevel={2}
          node={FilesUtils.treeify(files)}
          getNodesAndLeaves={(root?: FolderMetadataModel) => ({
            nodes: root?.folders,
            leaves: root?.files,
          })}
          factory={FileRow}
          focused={focusedFile}
          selected={fileSelection}
          getIdentifier={(file?: FolderMetadataModel | FileMetadataModel) =>
            file?.uri
          }
          onFocusChanged={(uri: string) => {
            dispatch(setFocus(uri));
          }}
          onSelectionChanged={(uris: string[]) => {
            dispatch(setFileSelection(uris));
          }}
          onDoubleClickLeaf={(e: MouseEvent, file: FileMetadataModel) => {
            dispatch(
              call({
                target: ServerCallTarget.WorkspaceOpenView,
                args: [file.uri],
              } as CallModel)
            );
          }}
        />
      )}
    </div>
  );
}

export default FileExplorer;
