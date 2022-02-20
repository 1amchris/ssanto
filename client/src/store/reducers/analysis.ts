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
export interface GeoFile {
  name: string;
  extention: string;
  view: boolean;
}
export interface AnalysisGeodatabase {
  files: GeoFile[];
}

export interface AnalysisObjectives {
  main: string;
  options: string[];
  primaries: {
    primary: string[];
    options: string[];
    secondaries: {
      secondary: string[];
      options: string[];
      attributes: {
        attribute: string[];
        attributeOptions: string[];
        dataset: string[];
        column: string[];
      }[];
    }[];
  }[];
}

export interface AnalysisState {
  parameters: AnalysisParameters;
  studyArea: AnalysisStudyArea;
  nbsSystem: AnalysisNbsSystem;
  objectives: AnalysisObjectives;
  geodatabase: AnalysisGeodatabase;
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
    geodatabase: {
      files: [
        { name: 'mtl_high', extention: '.json', view: false },
        { name: 'mtl_revenu_median', extention: '.shp', view: false },
        { name: 'mtl_parks', extention: '.shp', view: false },
      ],
    } as AnalysisGeodatabase,
    objectives: {
      main: '0',
      options: ['needs', 'oportunities'],
      primaries: [
        {
          primary: ['environmental', 'economic'],
          options: ['social', 'economic', 'environmental', 'legal', 'cultural'],
          secondaries: [
            {
              secondary: ['rainfall', 'slope'],
              options: [
                'slope',
                'rainfall',
                'topography',
                'contamination',
                'storage capacity',
              ],
              attributes: [
                {
                  attribute: ['rain days', 'annual rain'],
                  attributeOptions: [
                    'rain days',
                    'annual rain',
                    'max rain',
                    'min rain',
                  ],
                  dataset: ['file1', 'file2'],
                  column: ['c1', 'c2'],
                },
                {
                  attribute: ['digital elevation model'],
                  attributeOptions: ['digital elevation model'],
                  dataset: ['file1'],
                  column: ['c1'],
                },
              ],
            },
            {
              secondary: ['Land value'],
              options: [
                'road renewal',
                'street width or type',
                'utility infrastructure',
                ,
              ],
              attributes: [
                {
                  attribute: ['average house price', 'house price index'],
                  attributeOptions: [
                    'average house price',
                    'house price index',
                    'capital value',
                    'rental value',
                  ],
                  dataset: ['file1', 'file2'],
                  column: ['c1', 'c2'],
                },
              ],
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
    addGeoFile: (state, { payload }: PayloadAction<string>) => {
      console.warn('No validation was performed on the geodatabase');
      /* TODO: add additional validation here */
      state.geodatabase.files.push({
        name: payload,
        extention: 'shp',
        view: false,
      });
    },
    updateGeodatabase: (
      state,
      { payload: { files } }: PayloadAction<AnalysisGeodatabase>
    ) => {
      console.warn('No validation was performed on the geofile');
      /* TODO: add additional validation here */
      state.geodatabase.files = files;
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
  updateGeodatabase,
  addGeoFile,
  updateObjectives,
} = analysisSlice.actions;
export const selectAnalysis = (state: RootState) => state.analysis;

export default analysisSlice.reducer;
