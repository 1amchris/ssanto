import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import {
  createActionCreatorSyringe,
  InjectedPayload,
} from 'store/redux-toolkit-utils';
import AnalysisObjectivesModel from 'models/AnalysisObjectivesModel';
import FileMetadataModel from 'models/FileMetadataModel';

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
      files: [] as FileMetadataModel[],

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

    addFiles: (
      state,
      { payload: files }: PayloadAction<FileMetadataModel[]>
    ) => {
      state.properties.files = state.properties.files
        .concat(files)
        .filter(
          (file: FileMetadataModel, index: number, self: FileMetadataModel[]) =>
            self.findIndex(({ id }) => id === file.id) === index
        );
      state.properties.filesLoading = false;
    },

    deleteFile: (
      state,
      { payload: file }: PayloadAction<FileMetadataModel>
    ) => {
      state.properties.files = state.properties.files.filter(
        ({ id }: FileMetadataModel) => id !== file.id
      );
      state.properties.filesLoading = false;
    },

    studyAreaReceived: (state, { payload: data }: PayloadAction<any>) => {
      state.properties.studyArea.fileName = data.file_name;
      state.properties.studyArea.area = data.area;
      state.properties.studyAreaLoading = false;
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
      console.log('setLoading', property, isLoading);
      let temp: any = state.properties;
      temp[property + 'Loading'] = isLoading;
    },
  },
});

export const injectSetErrorCreator = createActionCreatorSyringe<string, string>(
  analysisSlice.actions.setError
);

export const injectSetLoadingCreator = createActionCreatorSyringe<
  string,
  boolean
>(analysisSlice.actions.setLoading);

export const {
  addFiles,
  deleteFile,
  receiveProperties,
  updateObjectives,
  studyAreaReceived,
} = analysisSlice.actions;

export const selectAnalysis = (state: RootState) => state.analysis;

export default analysisSlice.reducer;
