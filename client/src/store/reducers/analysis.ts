import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface AnalysisParameters {
  modelerName: string;
  analysisName: string;
  cellSize: number;
  coordinateSystem: string;
}

export interface AnalysisStudyArea {
  file?: File;
}

export interface AnalysisNbsSystem {
  type: string;
}

export interface AnalysisState {
  parameters: AnalysisParameters;
  studyArea: AnalysisStudyArea;
  nbsSystem: AnalysisNbsSystem;
}

export const analysisSlice = createSlice({
  name: 'analysis',
  initialState: {
    parameters: {
      modelerName: '',
      analysisName: '',
      cellSize: 20,
      coordinateSystem: '1',
    } as AnalysisParameters,
    studyArea: { file: undefined } as AnalysisStudyArea,
    nbsSystem: { type: '2' } as AnalysisNbsSystem,
  } as AnalysisState,
  reducers: {
    setParameters: (
      state,
      {
        payload: { modelerName, analysisName, cellSize, coordinateSystem },
      }: PayloadAction<AnalysisParameters>
    ) => {
      modelerName = modelerName.trim();
      if (modelerName.length < 3)
        console.error(
          `Modeler name must be at least 3 characters. Input: "${modelerName}"`
        );
      /* TODO: add additional validation here */ else
        state.parameters.modelerName = modelerName;

      analysisName = analysisName.trim();
      if (analysisName.length < 3)
        console.error(
          `Analysis name must be at least 3 characters. Input: "${analysisName}"`
        );
      /* TODO: add additional validation here */ else
        state.parameters.analysisName = analysisName;

      if (cellSize < 1)
        console.error(
          `The cell size must be of at least 1x1m. Input: "${cellSize}"`
        );
      /* TODO: add additional validation here */ else
        state.parameters.cellSize = cellSize;

      console.warn('No validation was performed on the coordinate system');
      /* TODO: add additional validation here */
      state.parameters.coordinateSystem = coordinateSystem;
    },
    setNbsSystemType: (
      state,
      { payload: { type } }: PayloadAction<AnalysisNbsSystem>
    ) => {
      console.warn('No validation was performed on the nbs system type');
      /* TODO: add additional validation here */
      state.nbsSystem.type = type;
    },
    setStudyArea: (
      state,
      { payload: { file } }: PayloadAction<AnalysisStudyArea>
    ) => {
      console.warn('No validation was performed on the study area file');
      /* TODO: add additional validation here */
      state.studyArea.file = file;
    },
  },
});

export const { setParameters, setNbsSystemType, setStudyArea } =
  analysisSlice.actions;
export const selectAnalysis = (state: RootState) => state.analysis;

export default analysisSlice.reducer;
