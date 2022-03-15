import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import categories from 'data/categories';
import CategoryModel from 'models/guide/CategoryModel';

export const guideSlice = createSlice({
  name: 'guide',
  initialState: { categories: categories || [] },
  reducers: {
    updateCategories: (
      state,
      { payload: categories }: PayloadAction<CategoryModel[]>
    ) => {
      console.warn('No validation has been made on the categories.');
      state.categories = categories;
    },
  },
});

export const { updateCategories } = guideSlice.actions;

export const selectGuide = (state: RootState) => state.guide;

export default guideSlice.reducer;
