import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { decode } from 'base64-arraybuffer';
import { saveAs } from 'file-saver';
import FileContentModel from 'models/file/FileContentModel';

export const exportSlice = createSlice({
  name: 'export',
  initialState: {},
  reducers: {
    exportData: (
      state,
      { payload: { name, content } }: PayloadAction<FileContentModel<any>>
    ) => {
      const file: File = new File([decode(content) as BlobPart], name);
      saveAs(file, name);
    },
  },
});

export const { exportData } = exportSlice.actions;

export default exportSlice.reducer;
