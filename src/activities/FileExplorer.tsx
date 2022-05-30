// import React, { createRef, RefObject, useState } from 'react';
import React, { createRef, RefObject } from 'react';
// import FileMetadataModel from 'models/file/FileMetadataModel';
import { BsTextLeft } from 'react-icons/bs';
// import ColorsUtils from 'utils/colors-utils';
// import { Color, Opacity } from 'enums/Color';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  selectFiles,
  setFileSelection,
  setFocus,
  // setFileSelection,
  // setFocus,
  setWorkspace,
} from 'store/reducers/files';
import { Button } from 'react-bootstrap';
import FilesUtils from 'utils/files-utils';
// import TreeView from 'components/common/TreeView';
import ListView from 'components/common/ListView';
import FileMetadataModel from 'models/file/FileMetadataModel';

// const backgroundColors = {
//   active: ColorsUtils.applyOpacity(Color.Primary, Opacity.SevenEighths),
//   disabled: ColorsUtils.applyOpacity(Color.LightGray, Opacity.Half),
//   focused: undefined,
//   hovered: ColorsUtils.applyOpacity(Color.LightGray, Opacity.OneQuarter),
//   default: ColorsUtils.applyOpacity(Color.Black, Opacity.Transparent),
// };

// const borderColors = {
//   active: undefined,
//   disabled: undefined,
//   focused: ColorsUtils.applyOpacity(Color.Info, Opacity.Opaque),
//   hovered: undefined,
//   default: ColorsUtils.applyOpacity(Color.Black, Opacity.Transparent),
// };

// const textColors = {
//   active: ColorsUtils.applyOpacity(Color.White, Opacity.Opaque),
//   disabled: ColorsUtils.applyOpacity(Color.Gray, Opacity.ThreeQuarters),
//   hovered: ColorsUtils.applyOpacity(Color.Black, Opacity.Opaque),
//   focused: ColorsUtils.applyOpacity(Color.Black, Opacity.Opaque),
//   default: ColorsUtils.applyOpacity(Color.Black, Opacity.Opaque),
// };

const FileRow = ({ name, relativePath }: any) => (
  <div className="w-100 px-2 text-truncate">
    <BsTextLeft /> {name} {<i>{relativePath}</i>}
  </div>
);

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

/**
 * File explorer component.
 * Used to visualize and manipulate the system's files.
 * @return {JSX.Element} Html.
 */
function FileExplorer({ style }: any) {
  const dispatch = useAppDispatch();
  const { files, fileSelection, focusedFile } = useAppSelector(selectFiles);

  const indexedFiles = FilesUtils.indexFiles(files);

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
      {/* <TreeView> */}
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
      {/* files.map((file: FileMetadataModel, index: number) => (
            <FileRowFactory
              onClick={(e: MouseEvent) => {
                const focusedIndex = files.findIndex(
                  (f: FileMetadataModel) => f.id === focusedFile
                );

                let newFileSelection = [];
                if (e.shiftKey && focusedIndex !== -1) {
                  newFileSelection = [...fileSelection];
                  const startIndex = Math.min(index, focusedIndex);
                  const endIndex = Math.max(index, focusedIndex);
                  for (let i = startIndex; i <= endIndex; i++) {
                    if (
                      newFileSelection.findIndex(
                        (f: string) => f === files[i].id
                      ) === -1
                    ) {
                      newFileSelection.push(files[i].id);
                    }
                  }
                }
                // TODO: Handle Windows/Mac events differently (e.g. ctrl/cmd)
                else if (e.ctrlKey || e.metaKey) {
                  const currentIndex = fileSelection.indexOf(file.id);
                  newFileSelection =
                    currentIndex === -1
                      ? [...fileSelection, file.id]
                      : fileSelection.filter((id: string) => id !== file.id);
                } else {
                  newFileSelection = [file.id];
                }

                dispatch(setFileSelection(newFileSelection));
                dispatch(setFocus(file.id));
              }}
              key={file.id}
              file={file}
              active={
                fileSelection.findIndex((id: string) => id === file.id) > -1
              }
              focused={focusedFile === file.id}
            />
          ))} */}
      {/* </TreeView> */}
    </div>
  );
}

export default FileExplorer;
