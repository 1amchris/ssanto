import { PayloadAction } from '@reduxjs/toolkit';
import ServerTargets from 'enums/ServerTargets';
import FileMetadataModel from 'models/file-models/FileMetadataModel';
import CallModel from 'models/server-coms/CallModel';
import { Dispatch, Middleware, MiddlewareAPI } from 'redux';
import {
  getFiles,
  injectSetErrorCreator,
  studyAreaReceived,
} from 'store/reducers/analysis';
import { Layer, upsertLayer } from 'store/reducers/map';
import { call } from 'store/reducers/server';

const AnalysisMiddleware: Middleware =
  ({ dispatch }: MiddlewareAPI) =>
  (next: Dispatch) =>
  <A extends PayloadAction<any>>(action: A) => {
    switch (action.type) {
      case studyAreaReceived.type:
        const { file_name, area } = action.payload;
        dispatch(
          upsertLayer({
            name: file_name,
            data: area,
          } as Layer)
        );
        dispatch(
          call({
            target: ServerTargets.FileManagerGetFiles,
            onSuccessAction: getFiles,
            onErrorAction: injectSetErrorCreator('files'),
          } as CallModel<void, FileMetadataModel[], void, string, string>)
        );
        return next(action);

      default:
        return next(action);
    }
  };

export default AnalysisMiddleware;
