import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import { UpdatePropertiesModel } from 'store/middlewares/AnalysisMiddleware';
import { Value } from 'store/models/Value';
import { Properties } from 'store/models/Properties';
import { AnalysisStudyArea } from 'store/models/AnalysisStudyArea';
import { StudyAreaChanged } from 'store/models/StudyAreaChanged';
import { AnalysisObjectives } from '../models/AnalysisObjectives';

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
      Object.entries(properties).forEach(([key, res]: [string, Value<any>]) => {
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
            value: { ...payload.value },
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
  receiveProperties,
  sendProperties,
  updateStudyAreaFiles,
  updateStudyArea,
  updateObjectives,
} = analysisSlice.actions;
export const selectAnalysis = (state: RootState) => state.analysis;

export default analysisSlice.reducer;
