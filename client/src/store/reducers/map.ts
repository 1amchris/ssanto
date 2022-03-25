import L from 'leaflet';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import { uniqueId } from 'lodash';
import { GeoJSON } from 'geojson';

export interface MapState {
  location: LatLong;
  zoom: number;
  coordinateSystem: string;
  layers: Layer[];
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

export const mapSlice = createSlice({
  name: 'map',
  initialState: {
    location: { lat: 45.509, long: -73.553 },
    zoom: 10,
    coordinateSystem: `${L.CRS.EPSG4326}`,
    layers: [],
  } as MapState,
  reducers: {
    updateLocation: (state, { payload: location }: PayloadAction<LatLong>) => {
      if (isNaN(location.lat) || isNaN(location.long))
        console.error('Invalid coordinates', location);
      else state.location = location;
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

export const { updateLocation, updateZoom, upsertLayer, removeLayer } =
  mapSlice.actions;

export const selectMap = (state: RootState) => state.map;

export default mapSlice.reducer;
