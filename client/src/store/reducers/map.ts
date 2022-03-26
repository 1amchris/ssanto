import L from 'leaflet';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import { uniqueId } from 'lodash';
import { GeoJSON } from 'geojson';

export interface MapState {
  location: LatLong; // the map location
  zoom: number;
  coordinateSystem: string;
  layers: Layer[];
  cursor?: LatLong; // the last registered position of the cursor on the map
  cursorInformations?: MapCursorInformations; // the information about the map at the cursor's location
}

export interface Layer {
  identifier?: string;
  label?: string;
  name: string;
  data: GeoJSON;
}

export interface LatLong {
  lat: number;
  long: number;
}

export interface MapCursorInformations {
  placeholder: string;
  // the placeholder is for dev purposes, and should be
  //  replaced by the actual information displayed.
}

export const mapSlice = createSlice({
  name: 'map',
  initialState: {
    location: { lat: 45.509, long: -73.553 }, // defaults to mtl.qc.ca
    coordinateSystem: `${L.CRS.EPSG4326}`, // defaults to the same coordinate system as Google Maps
    layers: [],
    zoom: 10, // arbitrary, is big enough to fit the island of mtl
  } as MapState,
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
      { payload }: PayloadAction<MapCursorInformations>
    ) => {
      // if any validation is required, add it here
      state.cursorInformations = payload;
    },
    updateZoom: (state, { payload: zoom }: PayloadAction<number>) => {
      if (zoom < 1) {
        console.error(
          `Error: the zoom must be a positive integer greater than 0; got ${zoom}`
        );
      } else {
        state.zoom = zoom;
      }
    },
    upsertLayer: (state, { payload: layer }: PayloadAction<Layer>) => {
      const index = state.layers.findIndex(
        ({ name }: Layer) => name === layer.name
      );

      state.layers.splice(index, 1, {
        identifier: uniqueId('layer-'),
        ...layer,
      } as Layer);
    },
    removeLayer: (state, { payload: name }: PayloadAction<string>) => {
      const index = state.layers.findIndex(
        (layer: Layer) => layer.name === name
      );

      if (index > -1) {
        state.layers.splice(index);
      }
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
} = mapSlice.actions;

export const selectMap = (state: RootState) => state.map;

export default mapSlice.reducer;
