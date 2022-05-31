import React, { useEffect } from 'react';
import { BsTextLeft } from 'react-icons/bs';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectFiles, setFileSelection, setFocus } from 'store/reducers/files';
import FilesUtils from 'utils/files-utils';
import ListView from 'components/common/ListView';
import FileMetadataModel from 'models/file/FileMetadataModel';
import NoWorkspaceSelected from 'components/activities/NoWorkspaceSelected';

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

  useEffect(() => {
    const treeedFiles = FilesUtils.treeify(files);
    console.log({ treeedFiles });
  }, [files]);

  const indexedFiles: [FileMetadataModel, number][] =
    FilesUtils.indexFiles(files);

  const selected = indexedFiles
    .filter(([file]) => fileSelection.includes(file.id))
    .map(([_, index]: [FileMetadataModel, number]) => index);

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
