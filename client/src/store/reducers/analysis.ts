import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { GeoJSON } from 'geojson';
import { updatePropertiesModel } from '../middlewares/AnalysisMiddleware';

export interface Value {
  error?: any;
  value?: any;
  isLoading: boolean;
}
export interface Properties {
  [key: string]: Value;
}

export interface AnalysisStudyArea {
  error?: any;
  value?: { area?: GeoJSON; fileName?: string };
  isLoading: boolean;
}

export interface StudyAreaChanged {
  value?: { fileName?: string; area?: GeoJSON };
  error?: any;
}

export interface AnalysisNbsSystem {
  type: string;
}

export interface AnalysisObjectives {
  main: string;
  primaries: {
    primary: string[];
    secondaries: {
      secondary: string[];
    }[];
  }[];
}

export interface AnalysisState {
  parameters: Properties;
  studyArea: AnalysisStudyArea;
  nbsSystem: AnalysisNbsSystem;
  objectives: AnalysisObjectives;
}

export const analysisSlice = createSlice({
  name: 'analysis',
  initialState: {
    parameters: {
      modelerName: { value: '', isLoading: false },
      analysisName: { value: '', isLoading: false },
      cellSize: { value: 20, isLoading: false },
    } as Properties,
    studyArea: {
      value: { area: undefined },
      isLoading: false,
    } as AnalysisStudyArea,
    nbsSystem: { type: '2' } as AnalysisNbsSystem,
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
    } as AnalysisObjectives,
  } as AnalysisState,
  reducers: {
    receiveParameterFromServer: (
      state,
      { payload }: PayloadAction<updatePropertiesModel>
    ) => {
      Object.entries(payload).forEach(
        ([key, { value, error }]: [string, any]) => {
          state.parameters[key] = { value, error, isLoading: false };
        }
      );
    },
    updateParameters: (
      state,
      {
        payload, //: { modelerName, analysisName, cellSize },
      }: PayloadAction<Properties>
    ) => {
      Object.entries(payload).forEach(([key, value]: [string, any]) => {
        state.parameters[key] = { value, isLoading: true };
      });
    },
    updateNbsSystemType: (
      state,
      { payload: { type } }: PayloadAction<AnalysisNbsSystem>
    ) => {
      console.warn('No validation was performed on the nbs system type');
      /* TODO: add additional validation here */
      state.nbsSystem.type = type;
    },
    updateStudyAreaFiles: (
      state,
      { payload: files }: PayloadAction<File[]>
    ) => {
      console.warn('No validation was performed on the study area files');
      /* TODO: add additional validation here */
      state.studyArea.isLoading = files.length > 0;
    },
    updateStudyArea: (state, { payload }: PayloadAction<StudyAreaChanged>) => {
      state.studyArea = payload.error
        ? { error: payload.error, isLoading: false }
        : {
            value: {
              fileName: payload!.value?.fileName,
              area: payload!.value?.area,
            },
            isLoading: false,
          };
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

export const {
  receiveParameterFromServer,
  updateParameters,
  updateNbsSystemType,
  updateStudyAreaFiles,
  updateStudyArea,
  updateObjectives,
} = analysisSlice.actions;
export const selectAnalysis = (state: RootState) => state.analysis;

export default analysisSlice.reducer;
