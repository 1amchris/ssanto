import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import {
  createActionWithInjectionBuilder,
  createActionWithPayloadBuilder,
  InjectedPayload,
} from 'store/redux-toolkit-utils';
import AnalysisObjectivesModel from 'models/AnalysisObjectivesModel';

export const analysisSlice = createSlice({
  name: 'analysis',
  initialState: {
    properties: {
      parameters: {
        modeler_name: '',
        analysis_name: '',
        cell_size: 20,
      },
      nbs_system: { system_type: '2' },
      studyArea: { fileName: '', area: undefined },
      files: [],

      parametersLoading: false,
      parametersError: '',
      nbsSystemLoading: false,
      nbsSystemError: '',
      studyAreaLoading: false,
      studyAreaError: '',
      filesLoading: false,
      filesError: '',
    },
    objectives: {
      main: '0',
      options: ['needs', 'oportunities'],
      primaries: [
        {
          primary: ['Provisioning', 'Socio-Economic'],
          options: [
            'Provisioning',
            'Socio-Economic',
            'Urban Form',
            'Biophysical',
          ],
          secondaries: [
            {
              secondary: ['Soil Type', 'Slope'],
              options: [
                'Soil Type',
                'Slope',
                'Irrigation Demand Distance',
                'test',
              ],
              attributes: [
                {
                  attribute: ['a', 'b'],
                  attributeOptions: ['a', 'b', 'c', 'd'],
                  //dataset: ['file1', 'file2'],
                  //column: ['c1', 'c2'],
                },
                {
                  attribute: ['a'],
                  attributeOptions: ['a', 'b'],
                  //dataset: ['file1'],
                  //column: ['c1'],
                },
              ],
            },
            {
              secondary: ['Education Level', 'Test'],
              options: ['Test', 'Education Level', 'a', 'b', 'c', 'd'],
              attributes: [
                {
                  attribute: ['a', 'b'],
                  attributeOptions: [
                    'average house price',
                    'house price index',
                    'capital value',
                    'rental value',
                  ],
                  //dataset: ['file1', 'file2'],
                  //column: ['c1', 'c2'],
                },
                {
                  attribute: ['a', 'b'],
                  attributeOptions: [
                    'average house price',
                    'house price index',
                    'capital value',
                    'rental value',
                  ],
                  //dataset: ['file1', 'file2'],
                  //column: ['c1', 'c2'],
                },
              ],
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
      }: PayloadAction<{ property: string; data: any }>
    ) => {
      if (state.properties.hasOwnProperty(property)) {
        let d: any = state.properties; // kinda hacky :/
        d[property] = data;
      }
    },

    studyAreaReceived: (state, { payload: data }: PayloadAction<any>) => {
      state.properties['studyAreaLoading'] = false;
      state.properties.studyArea.fileName = data.file_name;
      state.properties.studyArea.area = data.area;
    },

    updateObjectives: (
      state,
      { payload }: PayloadAction<AnalysisObjectivesModel>
    ) => {
      console.warn('No validation was performed on the objectives hierarchy');
      /* TODO: add additional validation here */
      //state.objectives = payload;
    },

    setError: (
      state,
      {
        payload: { injected: property, payload: error },
      }: PayloadAction<InjectedPayload<string, string>>
    ) => {
      let temp: any = state.properties;
      temp[property + 'Error'] = error;
      temp[property + 'Loading'] = false;
    },

    setLoading: (
      state,
      {
        payload: { injected: property, payload: isLoading = false },
      }: PayloadAction<InjectedPayload<string, boolean>>
    ) => {
      let temp: any = state.properties;
      temp[property + 'Loading'] = isLoading;
    },
  },
});

export const createSetErrorWithInjection = createActionWithInjectionBuilder<
  string,
  string
>(analysisSlice.actions.setError);

export const createSetLoadingWithInjection = createActionWithInjectionBuilder<
  string,
  boolean
>(analysisSlice.actions.setLoading);

export const createStudyAreaReceivedWithPayload =
  createActionWithPayloadBuilder<any>(analysisSlice.actions.studyAreaReceived);

export const { receiveProperties, updateObjectives, studyAreaReceived } =
  analysisSlice.actions;

export const selectAnalysis = (state: RootState) => state.analysis;

export default analysisSlice.reducer;
