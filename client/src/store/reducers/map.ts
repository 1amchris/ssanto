import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import { uniqueId } from 'lodash';
import { GeoJSON } from 'geojson';

export interface Layer {
  identifier: string;
  label: string;
  name: string;
  geojson: GeoJSON;
}

export interface Layers {
  [name: string]: Layer;
}

export interface LayersGroups {
  [name: string]: Layers;
}

export interface InsertLayerModel {
  group?: string;
  label?: string;
  name: string;
  geojson: GeoJSON;
}

export interface RemoveLayerModel {
  group?: string;
  name: string;
}
export class LayersGroupsUtils {
  static DEFAULT_GROUP = 'default';

  static add(
    layersGroups: LayersGroups,
    layer: InsertLayerModel
  ): LayersGroups {
    const group = layer.group || LayersGroupsUtils.DEFAULT_GROUP;

    const newLayer = {
      identifier: uniqueId('layer-'),
      name: layer.name,
      label: layer.label || layer.name,
      geojson: layer.geojson,
    } as Layer;

    if (!layersGroups.hasOwnProperty(group)) {
      layersGroups[group] = {} as Layers;
    }

    layersGroups[group][newLayer.name] = newLayer;
    return layersGroups;
  }

  static remove(
    layersGroups: LayersGroups,
    layer: RemoveLayerModel
  ): LayersGroups {
    const { name, group } = {
      group: LayersGroupsUtils.DEFAULT_GROUP,
      ...layer,
    };

    if (
      layersGroups.hasOwnProperty(group) &&
      layersGroups[group].hasOwnProperty(name)
    ) {
      delete layersGroups[group][name];

      if (Object.keys(layersGroups[group]).length) {
        delete layersGroups[group];
      }
    }

    return layersGroups;
  }
}

export interface MapState {
  location: LatLong; // the map location
  zoom: number;
  layers: LayersGroups;
  cursor?: LatLong; // the last registered position of the cursor on the map
  cursorInformations?: MapCursorInformations; // the information about the map at the cursor's location
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
    layers: {} as LayersGroups,
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
      state.layers = LayersGroupsUtils.add(state.layers, layer);
    },
    removeLayer: (
      state,
      { payload: layer }: PayloadAction<RemoveLayerModel>
    ) => {
      state.layers = LayersGroupsUtils.remove(state.layers, layer);
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
