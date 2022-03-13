import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import { AnalysisObjectives } from '../models/AnalysisObjectives';


const v = (value: any) => ({ value, isLoading: false });
export const analysisSlice = createSlice({
  name: 'analysis',
  initialState: {
    properties: {
      // Subjects
      parameters: {
        modeler_name: '',
        analysis_name: '',
        cell_size: 20,
      },
      nbs_system: { system_type: '2' },
      // Returned value
      studyArea: { fileName: '', area: undefined },
      // Js variables
      parametersLoading: false,
      parametersError: '',
      nbsSystemLoading: false,
      nbsSystemError: '',
      studyAreaLoading: false,
      studyAreaError: '',
    },
    objectives: {
      main: '0',
      primaries: [
        {
          primary: ['0', '1'],
          secondaries: [
            {
              secondary: ['0', '1', '2'],
            },
            {
              secondary: ['0', '1'],
            },
          ],
        },
      ],
    },
  },
  reducers: {
    receiveProperties: (
      state,
      {
        payload: { property, data },
      }: PayloadAction<{ property: string; data: any; }>
    ) => {
        if (state.properties.hasOwnProperty(property)) {
            let d: any = state.properties // kinda hacky :/
            d[property] = data
        }
    },

    defaultCallSuccess: (
        state,
        {
          payload: { params, data },
        }: PayloadAction<{ params: any, data: any }>
      ) => {
          //console.log("defaultCallSuccess called with data:", data)
          
      },
    defaultCallError: (
        state,
        {
          payload: { params, data },
        }: PayloadAction<{ params: any, data: any }>
      ) => {
          //console.log("defaultCallError called with data:", data)
      },

    setError: (
        state,
        {
            payload: { params, data },
          }: PayloadAction<{ params: any, data: any }>
      ) => {
          //console.log("SetError")
          let temp: any = state.properties;
          temp[params+'Error'] = data;    
          temp[params+'Loading'] = false;          
      },

    setLoading: (
        state,
        {
            payload: { params, data },
          }: PayloadAction<{ params: any, data: any }>
      ) => {
          //console.log("SetLoading")
          if (data == null)
            data = false;

          let temp: any = state.properties;
          temp[params+'Loading'] = data;          
      },

    studyAreaReceived: (
        state,
        {
            payload: { params, data },
          }: PayloadAction<{ params: any, data: any }>
      ) => {
          state.properties['studyAreaLoading'] = false;
          state.properties.studyArea.fileName = data.file_name;
          state.properties.studyArea.area = data.area;
      },

    updateObjectives: (
      state,
      { payload }: PayloadAction<AnalysisObjectives>
    ) => {
      console.warn('No validation was performed on the objectives hierarchy');
      /* TODO: add additional validation here */
      state.objectives = payload;
    },
  },
});

export const { receiveProperties, updateObjectives,
    defaultCallSuccess, defaultCallError,
    setError, setLoading,
    studyAreaReceived } =
  analysisSlice.actions;
export const selectAnalysis = (state: RootState) => state.analysis;

export default analysisSlice.reducer;
