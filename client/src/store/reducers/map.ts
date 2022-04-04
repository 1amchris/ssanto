import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import { LayersGroups, LayersUpdateGroups } from 'models/map/Layers';
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
    update_layers: {} as LayersUpdateGroups,
    zoom: 10, // arbitrary, is big enough to fit the island of mtl
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
    },
    updateSuitabilityAboveThreshold: (
      state,
      { payload }: PayloadAction<number>
    ) => {
      state.suitabilityAboveThreshold = payload;
    },
    updateSuitabilityCategories: (
      state,
      { payload }: PayloadAction<SuitabilityCategories>
    ) => {
      state.suitabilityCategories = payload;
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
    updateLayers: (state, { payload: layers }: PayloadAction<any>) => {
      state.update_layers = layers;
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
  updateLayers,
  upsertLayer,
  removeLayer,
  updateSuitabilityThreshold,
  updateSuitabilityAboveThreshold,
  updateSuitabilityCategories,
} = mapSlice.actions;

export const selectMap = (state: RootState) => state.map;

export default mapSlice.reducer;
