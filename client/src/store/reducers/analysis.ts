import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { GeoJSON } from 'geojson';

export interface AnalysisParameters {
  modelerName: string;
  analysisName: string;
}

export interface AnalysisStudyArea {
  error?: any;
  area?: GeoJSON;
  fileName?: string;
  loading: boolean;
}

export interface StudyAreaChanged {
  fileName?: string;
  area?: GeoJSON;
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
  parameters: AnalysisParameters;
  studyArea: AnalysisStudyArea;
  nbsSystem: AnalysisNbsSystem;
  objectives: AnalysisObjectives;
}

export const analysisSlice = createSlice({
  name: 'analysis',
  initialState: {
    parameters: {
      modelerName: '',
      analysisName: '',
    } as AnalysisParameters,
    studyArea: { area: undefined, loading: false } as AnalysisStudyArea,
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
    updateParameters: (
      state,
      {
        payload: { modelerName, analysisName },
      }: PayloadAction<AnalysisParameters>
    ) => {
      modelerName = modelerName.trim();
      if (modelerName.length < 3)
        return console.error(
          `Modeler name must be at least 3 characters. Input: "${modelerName}"`
        );
      /* TODO: add additional validation here */
      state.parameters.modelerName = modelerName;

      analysisName = analysisName.trim();
      if (analysisName.length < 3)
        return console.error(
          `Analysis name must be at least 3 characters. Input: "${analysisName}"`
        );
      /* TODO: add additional validation here */
      state.parameters.analysisName = analysisName;
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
      state.studyArea.loading = files.length > 0;
    },
    updateStudyArea: (state, { payload }: PayloadAction<StudyAreaChanged>) => {
      const defaults = { loading: false };
      state.studyArea = payload.error
        ? { error: payload.error, ...defaults }
        : { fileName: payload.fileName, area: payload.area, ...defaults };
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
  updateParameters,
  updateNbsSystemType,
  updateStudyAreaFiles,
  updateStudyArea,
  updateObjectives,
} = analysisSlice.actions;
export const selectAnalysis = (state: RootState) => state.analysis;

export default analysisSlice.reducer;
