import { studyAreaReceived, analysisReturn } from 'store/reducers/analysis';
import { InsertLayerModel, Layer, upsertLayer } from 'store/reducers/map';
import { PayloadAction } from '@reduxjs/toolkit';
import { Dispatch, Middleware, MiddlewareAPI } from 'redux';

const AnalysisMiddleware: Middleware =
  ({ dispatch }: MiddlewareAPI) =>
  (next: Dispatch) =>
  <A extends PayloadAction<any>>(action: A) => {
    switch (action.type) {
      case studyAreaReceived.type: {
        const { area } = action.payload;
        dispatch(
          upsertLayer({
            group: 'study area',
            label: 'study area',
            name: 'study area',
            geojson: area,
          } as InsertLayerModel)
        );
        return next(action);
      }

      case analysisReturn.type: {
        const { file_name, area } = action.payload;
        dispatch(
          upsertLayer({
            group: 'analysis',
            name: file_name,
            geojson: JSON.parse(area),
          } as InsertLayerModel)
        );
        return next(action);
      }

      default:
        return next(action);
    }
  };

export default AnalysisMiddleware;
