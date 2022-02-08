import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import L from 'leaflet';

export interface MapState {
  location: [number, number];
  zoom: number;
  coordinateSystem: L.CRS;
  cellSize: number;
  layers: Array<Layer>;
  //status: 'idle' | 'loading' | 'failed';
}

export interface Layer{
  name: string;
  data: any;
}

export const mapSlice = createSlice({
  name: 'map',
  initialState: {
    location:[45.509, -73.553],
    zoom: 10,
    coordinateSystem: L.CRS.EPSG3857,
    cellSize: 20,
    layers: new Array<Layer>(),
    //status: 'idle',
  } as MapState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateLocation: (state, action: PayloadAction<[number, number]>) => {
      state.location = action.payload;
    },

    updateCellSize: (state, action: PayloadAction<number>) => {
        state.cellSize = action.payload;
      },
    updateZoom: (state, action: PayloadAction<number>) => {
        state.zoom = action.payload;
      },
    updateCoordSys: (state, action: PayloadAction<L.CRS>) => {
        state.coordinateSystem = action.payload;
      },
    addLayer: (state, action: PayloadAction<Layer>) => {
      //TODO: check if a layer already has the same key
      state.layers.push(action.payload);
    },
  },
});

export const { updateLocation, updateCellSize, updateZoom, addLayer, updateCoordSys } = mapSlice.actions;

export const selectmap = (state: RootState) => (state.map);


export default mapSlice.reducer;
