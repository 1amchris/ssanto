import { PayloadAction } from '@reduxjs/toolkit';
import ServerCallTarget from 'enums/ServerCallTarget';
import { Dispatch, Middleware, MiddlewareAPI } from 'redux';
import {
  injectCancelObjectCreator,
  injectLoadObjectCreator,
  requestBlob,
} from 'store/reducers/blobber';
import { call } from 'store/reducers/server';

const BlobberMiddleware: Middleware =
  ({ dispatch }: MiddlewareAPI) =>
  (next: Dispatch) =>
  <A extends PayloadAction<any>>(action: A) => {
    switch (action.type) {
      case requestBlob.type: {
        dispatch(
          call({
            target: ServerCallTarget.BlobberGetObject,
            args: [action.payload],
            onSuccessAction: injectLoadObjectCreator(action.payload),
            onErrorAction: injectCancelObjectCreator(action.payload),
          })
        );
        return next(action);
      }

      default:
        return next(action);
    }
  };

export default BlobberMiddleware;
