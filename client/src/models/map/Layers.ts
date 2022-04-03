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

export interface LayersUpdateGroups {
    [name: string]: string[];
}