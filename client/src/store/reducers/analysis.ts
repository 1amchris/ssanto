import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { GeoJSON } from 'geojson';
import { updatePropertiesModel as UpdatePropertiesModel } from '../middlewares/AnalysisMiddleware';

export interface Value<ValueType> {
  error?: any;
  value?: ValueType;
}

export interface LoadingValue<ValueType> extends Value<ValueType> {
  isLoading: boolean;
}

export interface Properties {
  [key: string]: LoadingValue<any>;
}

export interface AreaFile {
  fileName?: string;
  area?: GeoJSON;
}

export interface AnalysisStudyArea extends LoadingValue<AreaFile> {}

export interface StudyAreaChanged {
  value?: AreaFile;
  error?: any;
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
  properties: {
    [key: string]: Properties;
  };
  studyArea: AnalysisStudyArea;
  objectives: AnalysisObjectives;
}

const v = (value: any) => ({ value, isLoading: false });
export const analysisSlice = createSlice({
  name: 'analysis',
  initialState: {
    properties: {
      parameters: {
        modelerName: v(''),
        analysisName: v(''),
        cellSize: v(20),
      } as Properties,
      nbsSystem: { systemType: v('2') } as Properties,
    },
    studyArea: v({}) as AnalysisStudyArea,
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
      {
        payload: { property, properties },
      }: PayloadAction<{ property: string; properties: UpdatePropertiesModel }>
    ) => {
      Object.entries(properties).forEach(([key, res]: [string, Value<any>]) => {
        state.properties[property][key] = res.error
          ? { error: res.error, isLoading: false }
          : {
              value: res.value,
              isLoading: false,
            };
      });
    },
    updateProperties: (
      state,
      {
        payload: { property, properties },
      }: PayloadAction<{ property: string; properties: Properties }>
    ) => {
      Object.entries(properties).forEach(([key, value]: [string, any]) => {
        state.properties[property][key] = { value, isLoading: true };
      });
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
  updateProperties,
  updateStudyAreaFiles,
  updateStudyArea,
  updateObjectives,
} = analysisSlice.actions;
export const selectAnalysis = (state: RootState) => state.analysis;

export default analysisSlice.reducer;
