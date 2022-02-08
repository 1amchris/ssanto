import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import L from 'leaflet';

export interface MapState {
  location: [number, number];
  zoom: number;
  coordinateSystem: L.CRS;
  cellSize: number;
  layers: Array<Layer>;
  clickedCoord:[number, number]
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
    clickedCoord: [NaN, NaN]
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
      if(!state.layers.some(u=>u.name === action.payload.name)) {
        state.layers.push(action.payload);
      }
      else{
        alert("layer already exists");
      }
      
    },
    updateClickedCoord: (state, action: PayloadAction<[number, number]>) => {
      state.clickedCoord = action.payload;
      console.log("LAT : ", state.clickedCoord[0]);
      console.log("LONG : ", state.clickedCoord[1]);
    },
  },
});

export const { updateLocation, updateCellSize, updateZoom, addLayer, updateCoordSys, updateClickedCoord } = mapSlice.actions;

export const selectmap = (state: RootState) => (state.map);


export default mapSlice.reducer;
