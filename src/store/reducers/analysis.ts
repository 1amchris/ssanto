import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import {
  createActionCreatorSyringe,
  InjectedPayload,
} from 'store/redux-toolkit-utils';
import FileMetadataModel from 'models/file/FileMetadataModel';
import LoadingValue from 'models/LoadingValue';
import AnalysisObjectivesModel from 'models/AnalysisObjectivesModel';
import ValueScalingModel from 'models/ValueScalingModel';

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
      study_area: '',
      files: [] as FileMetadataModel[],
      shapefiles: [],
      default_missing_data: 0,
      objectives_data: {
        name: 'ObjectivesHierarchy',
        mains: [] as any,
      },
      objectives: {
        main: 'Needs',
        primaries: {
          primary: [],
          weights: [],

          secondaries: [],
        },
      },
      value_scaling: [
        /*
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
      */
      ] as ValueScalingModel[],
      parametersLoading: false,
      parametersError: '',

      nbs_systemLoading: false,
      nbs_systemError: '',

      study_areaLoading: false,
      study_areaError: '',

      filesLoading: false,
      filesError: '',

      objectivesError: '',
      objectivesLoading: false,

      value_scalingError: '',
      value_scalingLoading: false,

      analysisLoading: false,
      analysisError: '',

      subAnalysisLoading: false,
      subAnalysisError: '',
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
        const d: any = state.properties; // kinda hacky :/
        d[property] = data;
      }
    },

    studyAreaReceived: (state, { payload: data }: PayloadAction<any>) => {
      state.properties.study_areaLoading = false;
    },

    updateObjectives: (
      state,
      { payload }: PayloadAction<AnalysisObjectivesModel>
    ) => {
      console.warn('No validation was performed on the objectives hierarchy');
    },

    setError: (
      state,
      {
        payload: { injected: property, payload: error },
      }: PayloadAction<InjectedPayload<string, string>>
    ) => {
      const temp: any = state.properties;
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
      const temp: any = state.properties;
      temp[property + 'Loading'] = isLoading;
      temp[property + 'Error'] = '';
    },

    analysisSuccess: (state, _: PayloadAction<any>) => {
      state.properties.analysisLoading = false;
    },
    subAnalysisSuccess: (state, _: PayloadAction<any>) => {
      state.properties.subAnalysisLoading = false;
    },

    resetError: (state) => {
        state.properties.parametersLoading = true;
        state.properties.parametersError = '';

        state.properties.nbs_systemLoading = true;
        state.properties.nbs_systemError = '';

        state.properties.study_areaLoading = true;
        state.properties.study_areaError = '';

        state.properties.filesLoading = true;
        state.properties.filesError = '';

        state.properties.objectivesError = '';
        state.properties.objectivesLoading = true;

        state.properties.value_scalingError = '';
        state.properties.value_scalingLoading = true;

        state.properties.analysisLoading = true;
        state.properties.analysisError = '';

        state.properties.subAnalysisLoading = true;
        state.properties.subAnalysisError = '';
    },
    loadingFileComplete: (state, _:PayloadAction<any>) => {
        state.properties.parametersLoading = false;
        state.properties.nbs_systemLoading = false;
        state.properties.study_areaLoading = false;
        state.properties.filesLoading = false;
        state.properties.objectivesLoading = false;
        state.properties.value_scalingLoading = false;
        state.properties.analysisLoading = false;
        state.properties.subAnalysisLoading = false;
    }
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

export const {
  updateObjectives,
  studyAreaReceived,
  analysisSuccess,
  subAnalysisSuccess,
  resetError,
  loadingFileComplete
} = analysisSlice.actions;

export const selectAnalysis = (state: RootState) => state.analysis;

export default analysisSlice.reducer;
