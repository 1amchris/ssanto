import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import L from 'leaflet';
import { RootState } from '../store';

export interface MapState {
  location: string;
  zoom: number;
  coordinateSystem: string;
  cellSize: number;
  layers: Array<string>;
  clickedCoord: string;
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
    location: JSON.stringify({ lat: 45.509, long: -73.553 }),
    zoom: 10,
    coordinateSystem: `${L.CRS.EPSG3857}`,
    cellSize: 20,
    layers: [],
    clickedCoord: JSON.stringify({ lat: NaN, long: NaN }),
  } as MapState,
  reducers: {
    updateLocation: (state, action: PayloadAction<LatLong>) => {
      if (!(isNaN(action.payload.lat) || isNaN(action.payload.long))) {
        state.location = JSON.stringify(action.payload);
      } else {
        console.error('Coordinates invalid', action.payload);
      }
    },
    updateCellSize: (state, action: PayloadAction<number>) => {
      state.cellSize = action.payload;
    },
    updateZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    updateCoordSys: (state, action: PayloadAction<string>) => {
      state.coordinateSystem = action.payload;
    },
    addLayer: (state, action: PayloadAction<Layer>) => {
      if (!state.layers.some(u => JSON.parse(u).name === action.payload.name)) {
        state.layers.push(JSON.stringify(action.payload));
      } else {
        console.error(
          `A layer with the same name "${action.payload.name}" already exists`
        );
      }
    },
    updateClickedCoord: (state, action: PayloadAction<LatLong>) => {
      state.clickedCoord = JSON.stringify(action.payload);
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
