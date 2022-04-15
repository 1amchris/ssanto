import { analysisSuccess, subAnalysisSuccess } from 'store/reducers/analysis';
import { cleanAnalysisLayers, upsertLayer } from 'store/reducers/map';
import { InsertLayerModel } from 'models/map/InsertLayerModel';
import { PayloadAction } from '@reduxjs/toolkit';
import { Dispatch, Middleware, MiddlewareAPI } from 'redux';

const AnalysisMiddleware: Middleware =
  ({ dispatch }: MiddlewareAPI) =>
  (next: Dispatch) =>
  <A extends PayloadAction<any>>(action: A) => {
    switch (action.type) {
      case analysisSuccess.type: {
        const { file_name: fileName, area } = action.payload;
        if (area === undefined) return;
        dispatch(
          upsertLayer({
            group: 'analysis',
            name: fileName,
            geojson: JSON.parse(area),
            activated: true,
          } as InsertLayerModel)
        );
        return next(action);
      }

      case subAnalysisSuccess.type: {
        dispatch(cleanAnalysisLayers());
        for (const subAnalysis in action.payload) {
          if (action.payload[subAnalysis].area !== undefined) {
            const { file_name: fileName, area } = action.payload[subAnalysis];
            dispatch(
              upsertLayer({
                group: 'sub_analysis',
                name: fileName,
                geojson: JSON.parse(area),
                activated: false,
              } as InsertLayerModel)
            );
          }
        }
        return next(action);
      }

      default:
        return next(action);
    }
  };

export default AnalysisMiddleware;
