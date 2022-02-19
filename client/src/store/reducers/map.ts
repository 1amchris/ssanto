import L from 'leaflet';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { uniqueId } from 'lodash';

export interface MapState {
  location: LatLong;
  zoom: number;
  coordinateSystem: string;
  cellSize: number;
  layers: Layer[];
  clickedCoord: LatLong;
}

export interface Layer {
  identifier?: string;
  name: string;
  data: any;
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
    coordinateSystem: `${L.CRS.EPSG3857}`,
    cellSize: 20,
    layers: [],
    clickedCoord: { lat: NaN, long: NaN },
  } as MapState,
  reducers: {
    updateLocation: (state, { payload: location }: PayloadAction<LatLong>) => {
      if (isNaN(location.lat) || isNaN(location.long))
        console.error('Invalid coordinates', location);
      else state.location = location;
    },
    updateCellSize: (state, action: PayloadAction<number>) => {
      state.cellSize = action.payload;
    },
    updateZoom: (state, { payload: zoom }: PayloadAction<number>) => {
      console.warn('Warning: no validation has been applied to zoom');
      state.zoom = zoom;
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
    updateClickedCoord: (
      state,
      { payload: location }: PayloadAction<LatLong>
    ) => {
      state.clickedCoord = location;
    },
  },
});

export const {
  updateLocation,
  updateCellSize,
  updateZoom,
  upsertLayer,
  updateClickedCoord,
} = mapSlice.actions;

export const selectMap = (state: RootState) => state.map;

export default mapSlice.reducer;
