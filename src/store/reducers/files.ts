import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sortBy } from 'lodash';
import FileMetadataModel from 'models/file/FileMetadataModel';
import { RootState } from 'store/store';
import FilesUtils from 'utils/files-utils';

export const filesSlice = createSlice({
  name: 'files',
  initialState: {
    workspaceRoot: undefined as string | undefined,
    files: [] as FileMetadataModel[],
    fileSelection: [] as string[],
    focusedFile: undefined as string | undefined,
  },
  reducers: {
    openWorkspace: (state, path: PayloadAction<string>) => {},
    setWorkspace: (
      state,
      { payload: files }: PayloadAction<FileMetadataModel[]>
    ) => {
      if (!files || files.length === 0) {
        state.workspaceRoot = undefined;
        state.files = [];
        return;
      }

      state.workspaceRoot = FilesUtils.extractRootPath(
        Array.from(files).map(f => FilesUtils.pathFromUri(f.uri))
      );
      state.files = sortBy(files, 'uri');
    },
    setFocus: (state, { payload: uri }: PayloadAction<string>) => {
      state.focusedFile = uri;
    },
    setFileSelection: (
      state,
      { payload: fileUris }: PayloadAction<string[]>
    ) => {
      state.fileSelection = fileUris;
    },
    resetWorkspace: state => {
      state.workspaceRoot = undefined;
      state.files = [];
      state.fileSelection = [];
      state.focusedFile = undefined;
    },
  },
});

export const {
  openWorkspace,
  setWorkspace,
  resetWorkspace,
  setFocus,
  setFileSelection,
} = filesSlice.actions;

export const selectFiles = (state: RootState) => state.files;

export default filesSlice.reducer;
