import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import {
  createActionCreatorSyringe,
  InjectedPayload,
} from 'store/redux-toolkit-utils';
import FileMetadataModel from 'models/file/FileMetadataModel';
import LoadingValue from 'models/LoadingValue';
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
      files: [] as FileMetadataModel[],

      parametersLoading: false,
      parametersError: '',

      nbsSystemLoading: false,
      nbsSystemError: '',

      studyAreaLoading: false,
      studyAreaError: '',

      filesLoading: false,
      filesError: '',

      objectivesError: '',
      objectivesLoading: false,

      valueScalingError: '',
      valueScalingLoading: false,

      analysisLoading: false,
      analysisError: '',

      objectives: {
        main: 'Needs',
        primaries: {
          primary: [],
          weights: [],

          secondaries: [],
        },
      },
      value_scaling: [
        {
          attribute: 'A',
          dataset: { name: 'Test1', id: '1' },
          type: 'Continuous',
          properties: { min: 0, max: 100, function: 'x' },
        },
        {
          attribute: 'B',
          dataset: { name: 'Test2', id: '2' },
          type: 'Boolean',
          properties: { categories: ['true', 'false'], values: [0, 0] },
        },
        {
          attribute: 'C',
          dataset: { name: 'Test3', id: '3' },
          type: 'Continuous',
          properties: { min: -180, max: 180, function: 'x' },
        },
      ],
    },
  },
  reducers: {
    receiveProperties: (
      state,
      {
        payload: { injected: property, payload: data },
      }: PayloadAction<InjectedPayload<string, any>>
    ) => {
      if (state.properties.hasOwnProperty(property)) {
        let d: any = state.properties; // kinda hacky :/
        d[property] = data;
      }
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

      console.error(
        `property ${property} has errored. Error:`,
        temp[property + 'Error']
      );
    },

    setLoading: (
      state,
      {
        payload: {
          injected: { value: property, isLoading },
        },
      }: PayloadAction<InjectedPayload<LoadingValue<string>, void>>
    ) => {
      let temp: any = state.properties;
      temp[property + 'Loading'] = isLoading;
    },

    analysisSuccess: (state, _: PayloadAction<any>) => {
      state.properties.analysisLoading = false;
    },
  },
});

export const injectSetErrorCreator = createActionCreatorSyringe<string, string>(
  analysisSlice.actions.setError
);

export const injectSetLoadingCreator = createActionCreatorSyringe<
  LoadingValue<string>,
  void
>(analysisSlice.actions.setLoading);

export const injectReceivePropertiesCreator = createActionCreatorSyringe<
  string,
  any
>(analysisSlice.actions.receiveProperties);

export const { updateObjectives, studyAreaReceived, analysisSuccess } =
  analysisSlice.actions;

export const selectAnalysis = (state: RootState) => state.analysis;

export default analysisSlice.reducer;
