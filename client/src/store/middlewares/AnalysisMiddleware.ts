import { studyAreaReceived, analysisReturn } from 'store/reducers/analysis';
import { Layer, upsertLayer } from 'store/reducers/map';
import { PayloadAction } from '@reduxjs/toolkit';
import { Dispatch, Middleware, MiddlewareAPI } from 'redux';

const AnalysisMiddleware: Middleware =
  ({ dispatch }: MiddlewareAPI) =>
  (next: Dispatch) =>
  <A extends PayloadAction<any>>(action: A) => {
    switch (action.type) {
      case studyAreaReceived.type: {
        const { file_name, area } = action.payload;
        dispatch(
          upsertLayer({
            name: file_name,
            data: area,
          } as Layer)
        );
        return next(action);
      }

      case analysisReturn.type: {
        const { file_name, analysis_data: area } = action.payload;
        console.log(action.payload);
        dispatch(
          upsertLayer({
            name: file_name,
            data: JSON.parse(area),
          } as Layer)
        );
        return next(action);
      }

      default:
        return next(action);
    }
  };

export default AnalysisMiddleware;
