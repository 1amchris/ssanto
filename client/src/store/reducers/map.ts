import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import { LayersGroups } from 'models/map/Layers';
import { LatLong } from 'models/map/LatLong';
import { MapCursorInformationsModel } from 'models/map/MapCursorInformationsModel';
import { MapStateModel } from 'models/map/MapStateModel';
import { RemoveLayerModel } from 'models/map/RemoveLayerModel';
import { InsertLayerModel } from 'models/map/InsertLayerModel';
import LayersUtils from 'utils/layers-utils';
import SuitabilityCategories from 'models/map/SuitabilityCategoriesModel';

export const mapSlice = createSlice({
  name: 'map',
  initialState: {
    location: { lat: 45.509, long: -73.553 }, // defaults to mtl.qc.ca
    layers: {} as LayersGroups,
    zoom: 10, // arbitrary, is big enough to fit the island of mtl
    suitabilityThreshold: 0.5,
    suitabilityAboveThreshold: 0.35,
  } as MapStateModel,
  reducers: {
    updateLocation: (state, { payload: location }: PayloadAction<LatLong>) => {
      if (isNaN(location?.lat) || isNaN(location?.long))
        console.error('Received invalid map location coordinates: ', location);
      else state.location = location;
    },
    updateCursor: (state, { payload: cursor }: PayloadAction<LatLong>) => {
      if (cursor && (isNaN(cursor.lat) || isNaN(cursor.long))) {
        console.error('Received invalid cursor coordinates: ', cursor);
        state.cursor = undefined;
      } else state.cursor = cursor;
    },
    updateCursorInformations: (
      state,
      { payload }: PayloadAction<MapCursorInformationsModel>
    ) => {
      // if any validation is required, add it here
      state.cursorInformations = payload;
    },
    updateSuitabilityThreshold: (state, { payload }: PayloadAction<number>) => {
      state.suitabilityThreshold = payload;
      console.log('suitability threshold changed:', payload);
    },
    updateSuitabilityAboveThreshold: (
      state,
      { payload }: PayloadAction<number>
    ) => {
      state.suitabilityAboveThreshold = payload;
      console.log('suitability above threshold changed:', payload);
    },
    updateSuitabilityCategories: (
      state,
      { payload }: PayloadAction<SuitabilityCategories>
    ) => {
      state.suitabilityCategories = payload;
      console.log('suitability categories changed:', payload);
    },
    updateZoom: (state, { payload: zoom }: PayloadAction<number>) => {
      if (zoom < 1) {
        console.error(
          `Error: the zoom must be a positive integer > 0; got ${zoom}`
        );
      } else {
        state.zoom = zoom;
      }
    },
    upsertLayer: (
      state,
      { payload: layer }: PayloadAction<InsertLayerModel>
    ) => {
      state.layers = LayersUtils.add(state.layers, layer);
    },
    removeLayer: (
      state,
      { payload: layer }: PayloadAction<RemoveLayerModel>
    ) => {
      state.layers = LayersUtils.remove(state.layers, layer);
    },
  },
});

export const {
  updateLocation,
  updateCursor,
  updateCursorInformations,
  updateZoom,
  upsertLayer,
  removeLayer,
  updateSuitabilityThreshold,
  updateSuitabilityAboveThreshold,
  updateSuitabilityCategories,
} = mapSlice.actions;

export const selectMap = (state: RootState) => state.map;

export default mapSlice.reducer;
