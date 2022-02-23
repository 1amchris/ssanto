import { createAction } from '@reduxjs/toolkit';
import { toSnakeProperties } from '../../utils';
import {
  updateNbsSystemType,
  updateParameters,
  updateStudyArea,
  updateStudyAreaFiles,
} from '../reducers/analysis';
import { Layer, removeLayer, upsertLayer } from '../reducers/map';
import { call, sendFiles, SendFilesModel } from './ServerMiddleware';

export interface updatePropertiesModel {
  [key: string]: any;
}

export const updateProperties =
  createAction<updatePropertiesModel>('updateProperties');

// TODO: Remove properties from model when forwarding action after dispatching server call
const AnalysisMiddleware = () => {
  return ({ dispatch }: any) =>
    (next: any) =>
    (action: any) => {
      switch (action.type) {
        case updateProperties.type:
          return Object.entries(action.payload).forEach(
            ([target, value]: [string, any]) => {
              dispatch(call({ target, args: [value] }));
            }
          );

        case updateParameters.type:
        case updateNbsSystemType.type:
          dispatch(updateProperties(toSnakeProperties(action.payload)));
          return next(action);

        case updateStudyAreaFiles.type:
          dispatch(
            sendFiles({
              target: 'study_area',
              files: action.payload,
            } as SendFilesModel)
          );
          return next(action);

        case updateStudyArea.type:
          const layerName = 'study area';
          if (!action.payload.error && action.payload.value?.area) {
            dispatch(
              upsertLayer({
                name: layerName,
                data: action.payload.value?.area,
              } as Layer)
            );
          } else if (action.payload.error) {
            dispatch(removeLayer(layerName));
          }
          return next(action);

        default:
          return next(action);
      }
    };
};

export default AnalysisMiddleware();
