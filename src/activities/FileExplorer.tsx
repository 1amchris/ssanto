import React, { useState } from 'react';
import { uniqueId } from 'lodash';
import FileMetadataModel from 'models/file/FileMetadataModel';
import { BsTextLeft } from 'react-icons/bs';
import ColorUtils from 'utils/color-utils';
import { Color, Opacity } from 'enums/Color';

const backgroundColors = {
  active: ColorUtils.applyOpacity(Color.Primary, Opacity.SevenEighths),
  disabled: ColorUtils.applyOpacity(Color.LightGray, Opacity.Half),
  focused: undefined,
  hovered: ColorUtils.applyOpacity(Color.LightGray, Opacity.OneQuarter),
  default: undefined,
};

const borderColors = {
  active: undefined,
  disabled: undefined,
  focused: ColorUtils.applyOpacity(Color.Info, Opacity.Opaque),
  hovered: undefined,
  default: undefined,
};

const textColors = {
  active: ColorUtils.applyOpacity(Color.White, Opacity.Opaque),
  disabled: ColorUtils.applyOpacity(Color.Gray, Opacity.ThreeQuarters),
  hovered: ColorUtils.applyOpacity(Color.Black, Opacity.Opaque),
  focused: ColorUtils.applyOpacity(Color.Black, Opacity.Opaque),
  default: ColorUtils.applyOpacity(Color.Black, Opacity.Opaque),
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
      className="w-100 small px-2"
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
      <small>
        <BsTextLeft /> {file.name}
      </small>
    </div>
  );
};

const files: FileMetadataModel[] = (
  [
    ['ActivityBar', 'tsx'],
    ['DefaultView', 'tsx'],
    ['EditorGroup', 'tsx'],
    ['EditorGroups', 'tsx'],
    ['FileExplorer', 'tsx'],
    ['electron', 'js'],
    ['.eslintrc', 'json'],
    ['package-lock', 'json'],
    ['package', 'json'],
    ['README', 'md'],
    ['requirements', 'txt'],
    ['tsconfig', 'json'],
  ] as [string, string][]
).map(
  ([stem, extension]: string[]) =>
    ({
      id: uniqueId('file-'),
      name: `${stem}.${extension}`,
      stem,
      extension,
    } as FileMetadataModel)
);

/**
 * File explorer component.
 * Used to upload and visualise the files in the system.
 * @param {any} param0 Parameters for the file explorer.
 * @return {JSX.Element} Html.
 */
function FileExplorer({
  onFileClicked = (id: string) => {},
  onFileSelectionChanged = (ids: string[]) => {},
}: any) {
  const [activeFiles, setActiveFiles] = useState<string[]>([]);
  const [focusedFile, setFocusedFile] = useState<string | undefined>(undefined);

  return (
    <React.Fragment>
      {files.map((file: FileMetadataModel, index: number) => (
        <FileRowFactory
          onClick={(e: MouseEvent) => {
            const focusedIndex = files.findIndex(
              (f: FileMetadataModel) => f.id === focusedFile
            );

            let newFileSelection = [];
            if (e.shiftKey && focusedIndex !== -1) {
              newFileSelection = [...activeFiles];
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
              const currentIndex = activeFiles.indexOf(file.id);
              newFileSelection =
                currentIndex === -1
                  ? [...activeFiles, file.id]
                  : activeFiles.filter((id: string) => id !== file.id);
            } else {
              newFileSelection = [file.id];
            }

            setActiveFiles(newFileSelection);
            onFileSelectionChanged(newFileSelection);

            setFocusedFile(file.id);
            onFileClicked(file.id);
          }}
          key={file.id}
          file={file}
          active={activeFiles.findIndex((id: string) => id === file.id) > -1}
          focused={focusedFile === file.id}
        />
      ))}
    </React.Fragment>
  );
}

export default FileExplorer;
