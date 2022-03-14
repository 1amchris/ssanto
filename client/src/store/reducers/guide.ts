import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import categories from 'data/categories';
import CategoryModel from 'models/guide-models/CategoryModel';

export const guideSlice = createSlice({
  name: 'guide',
  initialState: { categories: categories || [] },
  reducers: {
    updateCategories: (
      state,
      { payload: {params, data} }: PayloadAction<{params: any, data: CategoryModel[]}>
    ) => {
      console.warn('No validation has been made on the categories.');
      state.categories = data;
    },
  },
});

export const { updateCategories } = guideSlice.actions;

export const selectGuide = (state: RootState) => state.guide;

export default guideSlice.reducer;
