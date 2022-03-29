import { studyAreaReceived, analysisSuccess } from 'store/reducers/analysis';
import { upsertLayer } from 'store/reducers/map';
import { InsertLayerModel } from "models/map/InsertLayerModel";
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

      case analysisSuccess.type: {
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
