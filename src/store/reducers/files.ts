import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import FileMetadataModel from 'models/file/FileMetadataModel';
import { RootState } from 'store/store';

export const filesSlice = createSlice({
  name: 'files',
  initialState: {
    files: [] as FileMetadataModel[],
    fileSelection: [] as string[],
    focusedFile: null as string | null,
  },
  reducers: {
    setWorkspace: (
      state,
      { payload: files }: PayloadAction<FileMetadataModel[]>
    ) => {
      state.files = files;
    },
    setFocus: (state, { payload: fileId }: PayloadAction<string>) => {
      state.focusedFile = fileId;
    },
    setFileSelection: (
      state,
      { payload: fileIds }: PayloadAction<string[]>
    ) => {
      state.fileSelection = fileIds;
    },
    resetWorkspace: state => {
      state.files = [];
      state.fileSelection = [];
      state.focusedFile = null;
    },
  },
});

export const { setWorkspace, resetWorkspace, setFocus, setFileSelection } =
  filesSlice.actions;

export const selectFiles = (state: RootState) => state.files;

export default filesSlice.reducer;
