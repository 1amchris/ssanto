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
  extention: string;
  view: boolean;
  index: string;
  data?: GeoJSON;
}
export interface AnalysisGeodatabase {
  error?: any;
  files: GeoFile[];
  fileName?: String;
  area?: GeoJSON;
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
      deletedGeoFile: { index: v(-1) } as Properties,
      db: { files: v([]) } as Properties,
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
      //console.log('receiveProperties', property, properties);
      Object.entries(properties)
        .filter(([key, res]) => key && res)
        .forEach(([key, res]: [string, Value<any>]) => {
          state.properties[property][key] = res.error
            ? { error: res.error, isLoading: false }
            : {
                value: res.value,
                isLoading: false,
              };

          /* Fred: À retirer/ linker directement + Nom du fichier dans le json? */
          //TODO: FRED: ajouter un id au fileName et data
          if (property == 'newGeoFile' && key == 'fileName' && res.value) {
            state.geodatabase.files?.push({
              name: res.value,
              extention: '.json',
              view: false,
              index: '-1',
            });
          } else if (property == 'newGeoFile' && key == 'data' && res.value) {
            state.geodatabase.files[state.geodatabase.files.length - 1].data =
              res.value;
          } else if (property == 'newGeoFile' && key == 'index' && res.value) {
            state.geodatabase.files[state.geodatabase.files.length - 1].index =
              res.value;
            //TODO: validation à faire
          } else if (
            property == 'deletedGeoFile' &&
            key == 'index' &&
            res.value
          ) {
            state.geodatabase.files = state.geodatabase.files.filter(
              file => file.index !== res.value.index
            );
            console.log(state.geodatabase.files);
          }
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
      console.log('sendProperties', property, properties);
      Object.keys(properties).forEach((key: string) => {
        state.properties[property][key] = {
          ...state.properties[property][key],
          isLoading: true,
        };
      });
    },

    /* TODO: envoyer un index de file à retirer */

    deleteFile: (
      state,
      {
        payload: { property, properties },
      }: PayloadAction<{ property: string; properties: Properties }>
    ) => {
      console.log('sendProperties', properties);
      Object.keys(properties).forEach((key: string) => {
        state.properties[property][key] = {
          ...state.properties[property][key],
          isLoading: true,
        };
      });
    },

    /* TODO: envoyer un nom de file, data et index à ajouter */

    addFile: (
      state,
      {
        payload: { property, properties },
      }: PayloadAction<{ property: string; properties: Properties }>
    ) => {
      console.log('sendProperties', properties);
      Object.keys(properties).forEach((key: string) => {
        state.properties[property][key] = {
          ...state.properties[property][key],
          isLoading: true,
        };
      });
    },

    addGeoFile: state => {
      console.warn('No validation was performed on the geodatabase');
      /* TODO: add additional validation here */
      state.geodatabase?.files?.push({
        name: 'test',
        extention: 'shp',
        view: false,
        index: '-1',
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
  updateGeodatabase,
  addGeoFile,
} = analysisSlice.actions;
export const selectAnalysis = (state: RootState) => state.analysis;

export default analysisSlice.reducer;
