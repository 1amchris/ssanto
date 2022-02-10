import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import L from 'leaflet';
import { RootState } from '../store';

export interface MapState {
  location: LatLong;
  zoom: number;
  coordinateSystem: string;
  cellSize: number;
  layers: Layer[];
  clickedCoord: LatLong;
}

export interface Layer {
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
    updateCoordSys: (state, { payload: system }: PayloadAction<string>) => {
      console.warn(
        'Warning: no validation has been applied to coordinate system'
      );
      state.coordinateSystem = system;
    },
    addLayer: (state, { payload: layer }: PayloadAction<Layer>) => {
      if (state.layers.some(({ name }) => name === layer.name)) {
        console.error(
          `A layer with the same name "${layer.name}" already exists`
        );
      } else state.layers.push(layer);
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
  addLayer,
  updateCoordSys,
  updateClickedCoord,
} = mapSlice.actions;

export const selectMap = (state: RootState) => state.map;

export default mapSlice.reducer;
