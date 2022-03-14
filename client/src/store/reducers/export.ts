import L from 'leaflet';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import categories from 'data/categories';
import CategoryModel from 'models/guide/CategoryModel';

export const guideSlice = createSlice({
  name: 'guide',
  initialState: { categories: categories || [] },
  reducers: {
    exportPDF: (
      state,
      { payload: categories }: PayloadAction<CategoryModel[]>
    ) => {
      console.warn('No PDF has been exported.');
      state.categories = categories;
    },
    exportJPEG: (
      state,
      { payload: categories }: PayloadAction<CategoryModel[]>
    ) => {
      console.warn('No PDF has been exported.');
      state.categories = categories;
    },
  },
});

export const { exportPDF } = guideSlice.actions;
export const { exportJPEG } = guideSlice.actions;


export const selectGuide = (state: RootState) => state.guide;

export default guideSlice.reducer;
