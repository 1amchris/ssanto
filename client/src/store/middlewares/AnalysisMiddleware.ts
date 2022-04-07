import {
  studyAreaReceived,
  analysisSuccess,
  subAnalysisSuccess,
} from 'store/reducers/analysis';
import { cleanAnalysisLayers, upsertLayer } from 'store/reducers/map';
import { InsertLayerModel } from 'models/map/InsertLayerModel';
import { PayloadAction } from '@reduxjs/toolkit';
import { Dispatch, Middleware, MiddlewareAPI } from 'redux';

const AnalysisMiddleware: Middleware =
  ({ dispatch }: MiddlewareAPI) =>
  (next: Dispatch) =>
  <A extends PayloadAction<any>>(action: A) => {
    switch (action.type) {
      case studyAreaReceived.type: {
        const { area } = action.payload;
        /*dispatch(
          upsertLayer({
            group: 'study area',
            label: 'study area',
            name: 'study area',
            geojson: area,
          } as InsertLayerModel)
        );*/
        return next(action);
      }

      case analysisSuccess.type: {
        const { file_name, area } = action.payload;
        if (area == undefined) return;
        dispatch(
          upsertLayer({
            group: 'analysis',
            name: file_name,
            geojson: JSON.parse(area),
          } as InsertLayerModel)
        );
        return next(action);
      }

      case subAnalysisSuccess.type: {
        console.log('subAnalysisSuccess', action.payload);
        dispatch(cleanAnalysisLayers());
        for (const subAnalysis in action.payload) {
          console.log('subAnalysis', action.payload[subAnalysis]);
          const { file_name, area } = action.payload[subAnalysis];
          if (area == undefined) return;
          dispatch(
            upsertLayer({
              group: 'sub_analysis',
              name: file_name,
              geojson: JSON.parse(area),
            } as InsertLayerModel)
          );
        }
        /*
        const { file_name, area } = action.payload;
        if (area == undefined) return;
        dispatch(
          upsertLayer({
            group: 'analysis',
            name: file_name,
            geojson: JSON.parse(area),
          } as InsertLayerModel)
        );*/
        return next(action);
      }

      default:
        return next(action);
    }
  };

export default AnalysisMiddleware;
