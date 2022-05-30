import React, { createRef, RefObject } from 'react';
import { BsTextLeft } from 'react-icons/bs';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  selectFiles,
  setFileSelection,
  setFocus,
  setWorkspace,
} from 'store/reducers/files';
import { Button } from 'react-bootstrap';
import FilesUtils from 'utils/files-utils';
import ListView from 'components/common/ListView';
import FileMetadataModel from 'models/file/FileMetadataModel';

function NoWorkspaceSelected() {
  const dispatch = useAppDispatch();

  const handleFolderChanged =
    (onFolderChanged: (files: FileList) => void) =>
    ({ target: { files } }: React.ChangeEvent<HTMLInputElement>) =>
      files && files.length > 0 && onFolderChanged(files);

  const inputRef: RefObject<HTMLInputElement> = createRef();
  return (
    <div
      className="w-100 h-100 d-flex flex-column align-content-center"
      style={{ padding: '0 16px 0 20px' }}
    >
      <p>You have not yet opened a workspace.</p>
      <input
        ref={inputRef}
        type="file"
        className="visually-hidden"
        onChange={handleFolderChanged((files: FileList) =>
          dispatch(setWorkspace(FilesUtils.extractMetadataFromFiles(files)))
        )}
        /* @ts-expect-error */
        directory=""
        webkitdirectory=""
      />
      <Button
        type="submit"
        variant="primary"
        size="sm"
        className="w-100"
        style={{ maxWidth: 350, marginLeft: 'auto', marginRight: 'auto' }}
        onClick={() => inputRef.current?.click()}
      >
        Open workspace
      </Button>
    </div>
  );
}

function FileRow({ name, relativePath }: any) {
  return (
    <div className="w-100 px-2 text-truncate">
      <BsTextLeft /> {name} {<i>{relativePath}</i>}
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

  const indexedFiles: [FileMetadataModel, number][] =
    FilesUtils.indexFiles(files);

  const selected = indexedFiles
    .filter(([file]: [FileMetadataModel, number]) =>
      fileSelection.includes(file.id)
    )
    .map(([_, index]: [FileMetadataModel, number]) => index);
  fileSelection.map((id: string) => files.find((file: any) => file.id === id));

  const focused = indexedFiles.find(
    ([file]: [FileMetadataModel, number]) => focusedFile === file.id
  )?.[1];

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
        <ListView
          elements={files}
          factory={FileRow}
          focused={focused}
          selected={selected}
          onFocusChanged={(index: number) => {
            const selectedFile = files[index];
            dispatch(setFocus(selectedFile.id));
          }}
          onSelectionChanged={(indices: number[]) => {
            const selectedFiles = indices.map(
              (index: number) => files[index].id
            );
            dispatch(setFileSelection(selectedFiles));
          }}
        />
      )}
    </div>
  );
}

export default FileExplorer;
