import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import Task from 'models/ITask';

export const taskerSlice = createSlice({
  name: 'tasker',
  initialState: { tasks: [] } as { tasks: Task[] },
  reducers: {
    setTasks: (state, { payload: tasks }: PayloadAction<Task[]>) => {
      state.tasks = tasks;
    },
  },
});

export const { setTasks } = taskerSlice.actions;

export const selectTasker = (state: RootState) => state.tasker;

export default taskerSlice.reducer;
