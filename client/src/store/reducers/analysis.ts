import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GeoJSON } from 'geojson';
import { RootState } from 'store/store';
import { UpdatePropertiesModel } from 'store/middlewares/AnalysisMiddleware';
import { Value } from 'store/models/Value';
import { Properties } from 'store/models/Properties';
import { AnalysisObjectives } from '../models/AnalysisObjectives';

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
  extension: string;
  id: string;
}
export interface AnalysisGeodatabase {
  error?: any;
  files: GeoFile[];
  loading?: boolean;
}

export interface AnalysisObjectivesTemp {
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
        //dataset: string[];
        //column: string[];
      }[];
    }[];
  }[];
}

export interface AnalysisState {
  properties: {
    [key: string]: Properties;
  };
  objectives: AnalysisObjectivesTemp;
  geodatabase: AnalysisGeodatabase;
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
      studyArea: { fileName: v(''), area: v(undefined) } as Properties,
      newGeoFile: {
        fileName: v(''),
        data: v(undefined),
        index: v(-1),
      } as Properties,
    },
    geodatabase: {
      files: [],
      fileName: '',
    } as AnalysisGeodatabase,
    objectives: {
      main: '0',
      options: ['needs', 'oportunities'],
      primaries: [
        {
          primary: ['Biophysical', 'Socio-Economic'],
          secondaries: [
            {
              secondary: ['Soil Type', 'Slope'],
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
              secondary: ['Education Level'],
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
              ],
            },
          ],
        },
      ],
    } as AnalysisObjectivesTemp,
  } as AnalysisState,
  reducers: {
    /**
     * receiveProperties
     *  Updates generated fields of a property in state.properties
     * Example:
     *  Before method execution
     *    state: {
     *      properties: {
     *        foo: {
     *          a: { isLoading: false, value: 1 },
     *          b: { isLoading: true,  value: '2' }
     *        },
     *        bar: {
     *          c: { isLoading: true, value: '3' }
     *        }
     *      }
     *    }
     *    payload: {
     *      property: 'foo',
     *      properties: {
     *        a: { error: "couldn't update" },
     *        c: { value: '10' }
     *      }
     *    }
     *
     *  After method execution:
     *    state: {
     *      properties: {
     *        foo: {
     *          a: { isLoading: false, error: "couldn't update" },
     *          b: { isLoading: false, value: '2' },
     *          c: { isLoading: false, value: '10' }
     *        },
     *        bar: {
     *          c: { isLoading: false, value: '3' }
     *        }
     *      }
     */
    receiveProperties: (
      state,
      {
        payload: { property, properties },
      }: PayloadAction<{ property: string; properties: UpdatePropertiesModel }>
    ) => {
      Object.entries(properties)
        .filter(([key, res]) => key && res)
        .forEach(([key, res]: [string, Value<any>]) => {
          state.properties[property][key] = res.error
            ? { error: res.error, isLoading: false }
            : {
                value: res.value,
                isLoading: false,
              };
        });
    },

    /**
     * sendProperties
     *  Sends modified fields to the server through a
     *  middleware call and updates isLoading property
     * Example:
     *  Before method execution
     *    state: {
     *      properties: {
     *        foo: {
     *          a: { isLoading: false, value: 1 },
     *          b: { isLoading: true,  value: '2' }
     *        },
     *        bar: {
     *          c: { isLoading: true, value: '3' }
     *        }
     *      }
     *    }
     *    payload: {
     *      property: 'foo',
     *      properties: {
     *        a: { value: 1 },
     *        c: { value: '10' }
     *      }
     *    }
     *
     *  After method execution:
     *    state: {
     *      properties: {
     *        foo: {
     *          a: { isLoading: true, value: 1 },
     *          b: { isLoading: false, value: '2' },
     *          c: { isLoading: true }
     *        },
     *        bar: {
     *          c: { isLoading: false, value: '3' }
     *        }
     *      }
     */
    sendProperties: (
      state,
      {
        payload: { property, properties },
      }: PayloadAction<{ property: string; properties: Properties }>
    ) => {
      Object.keys(properties).forEach((key: string) => {
        state.properties[property][key] = {
          ...state.properties[property][key],
          isLoading: true,
        };
      });
    },

    /* Delete the file with the specify index from the db */
    deleteFile: (
      state,
      { payload: { index } }: PayloadAction<{ index: string }>
    ) => {},

    /* Update client geodatabase */
    updateGeoDataBase: (
      state,
      {
        payload: { value, error },
      }: PayloadAction<{ value: GeoFile[]; error: any }>
    ) => {
      if (error) {
        console.warn('Error with update of geoDatabase');
      } else {
        state.geodatabase.files = value;
      }
    },

    addGeoFile: state => {
      console.warn('No validation was performed on the geodatabase');
      /* TODO: add additional validation here */
      state.geodatabase?.files?.push({
        name: 'test',
        extension: 'shp',
        id: '-1',
      });
    },

    updateObjectives: (
      state,
      { payload }: PayloadAction<AnalysisObjectivesTemp>
    ) => {
      console.warn('No validation was performed on the objectives hierarchy');
      /* TODO: add additional validation here */
      state.objectives = payload;
    },
  },
});

export const {
  receiveProperties,
  sendProperties,
  updateObjectives,
  updateGeoDataBase,
  addGeoFile,
  deleteFile,
} = analysisSlice.actions;
export const selectAnalysis = (state: RootState) => state.analysis;

export default analysisSlice.reducer;
