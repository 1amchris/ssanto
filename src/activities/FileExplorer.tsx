import React, { createRef, RefObject, useState } from 'react';
import FileMetadataModel from 'models/file/FileMetadataModel';
import { BsTextLeft } from 'react-icons/bs';
import ColorsUtils from 'utils/colors-utils';
import { Color, Opacity } from 'enums/Color';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  selectFiles,
  setFileSelection,
  setFocus,
  setWorkspace,
} from 'store/reducers/files';
import { Button } from 'react-bootstrap';
import FilesUtils from 'utils/files-utils';

const backgroundColors = {
  active: ColorsUtils.applyOpacity(Color.Primary, Opacity.SevenEighths),
  disabled: ColorsUtils.applyOpacity(Color.LightGray, Opacity.Half),
  focused: undefined,
  hovered: ColorsUtils.applyOpacity(Color.LightGray, Opacity.OneQuarter),
  default: undefined,
};

const borderColors = {
  active: undefined,
  disabled: undefined,
  focused: ColorsUtils.applyOpacity(Color.Info, Opacity.Opaque),
  hovered: undefined,
  default: undefined,
};

const textColors = {
  active: ColorsUtils.applyOpacity(Color.White, Opacity.Opaque),
  disabled: ColorsUtils.applyOpacity(Color.Gray, Opacity.ThreeQuarters),
  hovered: ColorsUtils.applyOpacity(Color.Black, Opacity.Opaque),
  focused: ColorsUtils.applyOpacity(Color.Black, Opacity.Opaque),
  default: ColorsUtils.applyOpacity(Color.Black, Opacity.Opaque),
};

const FileRowFactory = ({
  file,
  disabled,
  active,
  focused,
  onClick = () => {},
}: any) => {
  const [hovered, setHovered] = useState(false);

  const row = {
    cursor: disabled ? 'default' : 'pointer',
    color:
      active && textColors.active
        ? textColors.active
        : focused && textColors.focused
        ? textColors.focused
        : hovered && textColors.hovered
        ? textColors.hovered
        : disabled && textColors.disabled
        ? textColors.disabled
        : textColors.default,
    borderColor:
      active && borderColors.active
        ? borderColors.active
        : focused && borderColors.focused
        ? borderColors.focused
        : hovered && borderColors.hovered
        ? borderColors.hovered
        : disabled && borderColors.disabled
        ? borderColors.disabled
        : borderColors.default,
    backgroundColor:
      active && backgroundColors.active
        ? backgroundColors.active
        : focused && backgroundColors.focused
        ? backgroundColors.focused
        : hovered && backgroundColors.hovered
        ? backgroundColors.hovered
        : disabled && backgroundColors.disabled
        ? backgroundColors.disabled
        : backgroundColors.default,
  };

  return (
    <div
      className="w-100 px-2"
      onClick={(e: any) => !disabled && onClick(e)}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => !disabled && setHovered(false)}
      style={{
        color: row.color,
        background: row.backgroundColor,
        border: `1px solid ${row.borderColor || 'transparent'}`,
        cursor: row.cursor,
      }}
    >
      <BsTextLeft /> {file.name}
    </div>
  );
};

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
function FileExplorer() {
  const dispatch = useAppDispatch();
  const { files, fileSelection, focusedFile } = useAppSelector(selectFiles);

  return (
    <div
      className="w-100 h-100"
      style={{
        fontSize: '10pt',
      }}
    >
      {!files?.length && <NoWorkspaceSelected />}
      {files?.length > 0 &&
        files.map((file: FileMetadataModel, index: number) => (
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
        ))}
    </div>
  );
}

export default FileExplorer;
