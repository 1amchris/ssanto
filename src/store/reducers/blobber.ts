import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createActionCreatorSyringe,
  InjectedPayload,
} from 'store/redux-toolkit-utils';
import { RootState } from 'store/store';

export const blobberSlice = createSlice({
  name: 'blobber',
  initialState: {
    blobs: {},
    requestedBlobs: [],
  } as {
    blobs: { [key: string]: any };
    requestedBlobs: string[];
  },
  reducers: {
    filterBlobs: (state, { payload: objectIds }) => {
      state.blobs = Object.fromEntries(
        Object.entries(state.blobs).filter(([key]) => objectIds.includes(key))
      );
    },
    requestBlob: (state, { payload: uri }) => {
      state.requestedBlobs.push(uri);
    },
    loadBlob: (
      state,
      {
        payload: { injected: uri, payload: data },
      }: PayloadAction<InjectedPayload<string, any>>
    ) => {
      state.blobs[uri] = data;
      state.requestedBlobs = state.requestedBlobs.filter(item => item !== uri);
    },
    cancelRequest: (state, { payload: uri }) => {
      // Don't do anything with the current data if there's any.
      // Stop the loading if any.
      state.requestedBlobs = state.requestedBlobs.filter(item => item !== uri);
    },
  },
});

export const injectLoadObjectCreator = createActionCreatorSyringe<string, any>(
  blobberSlice.actions.loadBlob
);

export const injectCancelObjectCreator = (uri: string) => () =>
  blobberSlice.actions.cancelRequest(uri);

export const { filterBlobs, requestBlob, cancelRequest } = blobberSlice.actions;

export const selectBlobber = (state: RootState) => state.blobber;

export default blobberSlice.reducer;
