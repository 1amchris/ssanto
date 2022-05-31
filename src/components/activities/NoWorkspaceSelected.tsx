import React, { createRef, RefObject } from 'react';
import { useAppDispatch } from 'store/hooks';
import { setWorkspace } from 'store/reducers/files';
import { Button } from 'react-bootstrap';
import FilesUtils from 'utils/files-utils';

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

export default NoWorkspaceSelected;
