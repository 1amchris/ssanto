import React from 'react';
import { BsTextLeft } from 'react-icons/bs';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectFiles, setFileSelection, setFocus } from 'store/reducers/files';
import FileMetadataModel from 'models/file/FileMetadataModel';
import FolderMetadataModel from 'models/file/FolderMetadataModel';
import NoWorkspaceSelected from 'components/activities/NoWorkspaceSelected';
import ListView from 'components/common/ListView';
import FormControl from 'components/forms/components/FormControl';

/**
 * File searcher component.
 * Used to visualize and manipulate the system's files.
 * @return {JSX.Element} Html.
 */
function FileSearcher({ style }: any) {
  const dispatch = useAppDispatch();
  const { files, fileSelection, focusedFile } = useAppSelector(selectFiles);

  const [search, setSearch] = React.useState('');
  const [searchResult, setSearchResult] = React.useState<FileMetadataModel[]>(
    []
  );

  const FileRow = ({ name, relativePath }: any) => {
    const normalizedName = name.toLowerCase();
    const normalizedSearch = search.toLowerCase();

    const startOfHighlight = normalizedName.indexOf(normalizedSearch);
    const endOfHighlight = startOfHighlight + search.length;

    const beforeHighlight = name.substring(0, startOfHighlight);
    const highlight = name.substring(startOfHighlight, endOfHighlight);
    const afterHighlight = name.substring(endOfHighlight);

    return (
      <div className="w-100 px-2 text-truncate">
        <BsTextLeft /> {beforeHighlight}
        <mark className="px-0 bg-warning">{highlight}</mark>
        {afterHighlight} {<i className="text-secondary">{relativePath}</i>}
      </div>
    );
  };

  const handleSearch = (value: string) => {
    console.log({ value });
    setSearch(value);

    const normalizedValue = value.toLowerCase();
    setSearchResult(
      value === ''
        ? []
        : files.filter(file =>
            file.name.toLocaleLowerCase().includes(normalizedValue)
          )
    );
  };

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
        <React.Fragment>
          <form style={{ padding: '6px 0', margin: '0 12px' }}>
            <FormControl
              hideLabel
              value={search}
              label="Search"
              placeholder="Search"
              className="btn-sm"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleSearch(e.target.value)
              }
            />
          </form>
          <ListView
            elements={searchResult}
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
          />
        </React.Fragment>
      )}
    </div>
  );
}

export default FileSearcher;
