import { PayloadAction } from '@reduxjs/toolkit';
import ServerCallTarget from 'enums/ServerCallTarget';
import { Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { openWorkspace } from 'store/reducers/files';
import { call } from 'store/reducers/server';

const FilesMiddleware: Middleware =
  ({ dispatch }: MiddlewareAPI) =>
  (next: Dispatch) =>
  <A extends PayloadAction<any>>(action: A) => {
    switch (action.type) {
      case openWorkspace.type: {
        dispatch(
          call({
            target: ServerCallTarget.FilesOpenWorkspace,
            args: [action.payload],
            // TODO: There should maybe be an "onSuccessAction"
            // TODO: There should maybe be an "onErrorAction"
          })
        );
        return;
      }

      default:
        return next(action);
    }
  };

export default FilesMiddleware;
