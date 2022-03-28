import { GeoJSON } from 'geojson';


export interface InsertLayerModel {
  group?: string;
  label?: string;
  name: string;
  geojson: GeoJSON;
}
