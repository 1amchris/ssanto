import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface AnalysisParameters {
  modelerName: string;
  analysisName: string;
}

export interface AnalysisStudyArea {
  file?: File;
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
    studyArea: { file: undefined } as AnalysisStudyArea,
    nbsSystem: { type: '2' } as AnalysisNbsSystem,
    objectives: {
      main: '1',
      primaries: [
        {
          primary: ['1', '0'],
          secondaries: [
            {
              secondary: ['0', '1', '0'],
            },
            {
              secondary: ['2', '0'],
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
    updateStudyArea: (
      state,
      { payload: { file } }: PayloadAction<AnalysisStudyArea>
    ) => {
      console.warn('No validation was performed on the study area file');
      /* TODO: add additional validation here */
      state.studyArea.file = file;
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
  updateStudyArea,
  updateObjectives,
} = analysisSlice.actions;
export const selectAnalysis = (state: RootState) => state.analysis;

export default analysisSlice.reducer;
