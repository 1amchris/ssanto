import React from 'react';
import { BsTextLeft } from 'react-icons/bs';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectFiles, setFileSelection, setFocus } from 'store/reducers/files';
import FileMetadataModel from 'models/file/FileMetadataModel';
import FolderMetadataModel from 'models/file/FolderMetadataModel';
import NoWorkspaceSelected from 'components/views/core/NoWorkspaceSelected';
import ListView from 'components/common/ListView';
import ServerCallTarget from 'enums/ServerCallTarget';
import CallModel from 'models/server-coms/CallModel';
import { call } from 'store/reducers/server';
import { Form } from 'react-bootstrap';

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
    const startOfHighlight = name.toLowerCase().indexOf(search.toLowerCase());
    const endOfHighlight = startOfHighlight + search.length;

    return (
      <div className="w-100 px-2 text-truncate">
        <BsTextLeft /> {name.substring(0, startOfHighlight)}
        <mark className="px-0 bg-warning">
          {name.substring(startOfHighlight, endOfHighlight)}
        </mark>
        {name.substring(endOfHighlight)}{' '}
        {<i className="text-secondary">{relativePath}</i>}
      </div>
    );
  };

  const handleSearch = (value: string) => {
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
            <Form.Control
              size="sm"
              value={search}
              placeholder="Search"
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
            onDoubleClickRow={(e: MouseEvent, file: FileMetadataModel) => {
              dispatch(
                call({
                  target: ServerCallTarget.WorkspaceOpenView,
                  args: [file.uri],
                } as CallModel)
              );
            }}
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
