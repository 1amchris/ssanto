import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { decode } from 'base64-arraybuffer';
import { saveAs } from 'file-saver';
import FileContentModel from 'models/file-models/FileContentModel';

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

    exportPDF: (state, { payload }: PayloadAction<any>) => {
      console.warn('No PDF has been exported.');
    },

    exportJPEG: (state, { payload }: PayloadAction<any>) => {
      console.warn('No PDF has been exported.');
    },
  },
});

export const { exportData, exportPDF, exportJPEG } = exportSlice.actions;

export default exportSlice.reducer;
