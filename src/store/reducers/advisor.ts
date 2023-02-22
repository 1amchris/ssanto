import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import CategoryModel from 'models/advisor/CategoryModel';

export const advisorSlice = createSlice({
  name: 'advisor',
  initialState: { categories: [] as CategoryModel[] },
  reducers: {
    updateCategories: (
      state,
      { payload: categories }: PayloadAction<CategoryModel[]>
    ) => {
      state.categories = categories;
    },
  },
});

export const { updateCategories } = advisorSlice.actions;

export const selectAdvisor = (state: RootState) => state.advisor;

export default advisorSlice.reducer;
