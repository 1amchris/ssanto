import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sortBy } from 'lodash';
import FileMetadataModel from 'models/file/FileMetadataModel';
import { RootState } from 'store/store';

export const filesSlice = createSlice({
  name: 'files',
  initialState: {
    files: [] as FileMetadataModel[],
    fileSelection: [] as string[],
    focusedFile: undefined as string | undefined,
  },
  reducers: {
    setWorkspace: (
      state,
      { payload: files }: PayloadAction<FileMetadataModel[]>
    ) => {
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
      state.files = [];
      state.fileSelection = [];
      state.focusedFile = undefined;
    },
  },
});

export const { setWorkspace, resetWorkspace, setFocus, setFileSelection } =
  filesSlice.actions;

export const selectFiles = (state: RootState) => state.files;

export default filesSlice.reducer;
