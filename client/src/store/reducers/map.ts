import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import L from 'leaflet';



export interface MapState {
  location: string;
  zoom: number;
  coordinateSystem: string;
  cellSize: number;
  layers: Array<string>;
  clickedCoord:string
  //status: 'idle' | 'loading' | 'failed';
}

export interface Layer{
  name: string;
  data: any;
}
export interface LatLong{
  lat: number;
  long: number;
}

export const mapSlice = createSlice({
  name: 'map',
  initialState: {
    location:JSON.stringify({lat: 45.509, long: -73.553}),
    zoom: 10,
    coordinateSystem: "EPSG3857",
    cellSize: 20,
    layers: new Array(),
    clickedCoord: JSON.stringify({lat: NaN, long: NaN}),
    //status: 'idle',
  } as MapState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateLocation: (state, action: PayloadAction<LatLong>) => {
      if( !(isNaN(action.payload.lat) || isNaN(action.payload.long))){
        state.location = JSON.stringify(action.payload);
      }
      else{
        alert("Not a valid coord")
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
      if(!state.layers.some(u=>JSON.parse(u).name === action.payload.name)) {
        state.layers.push(JSON.stringify(action.payload));
      }
      else{
        alert("layer already exists");
      }
    },
    updateClickedCoord: (state, action: PayloadAction<LatLong>) => {
      state.clickedCoord = JSON.stringify(action.payload);
      console.log("LAT : ", JSON.parse(state.clickedCoord).lat);
      console.log("LONG : ",JSON.parse(state.clickedCoord).long);
    },
  },
});

export const { updateLocation, updateCellSize, updateZoom, addLayer, updateCoordSys, updateClickedCoord } = mapSlice.actions;

export const selectmap = (state: RootState) => (state.map);


export default mapSlice.reducer;
