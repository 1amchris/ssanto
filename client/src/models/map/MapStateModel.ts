import { LayersGroups, LayersUpdateGroups } from './Layers';
import { LatLong } from './LatLong';
import { MapCursorInformationsModel } from './MapCursorInformationsModel';

export interface MapStateModel {
  location: LatLong; // the map location
  zoom: number;
  layers: LayersGroups;
  update_layers: LayersUpdateGroups;
  cursor?: LatLong; // the last registered position of the cursor on the map
  cursorInformations?: MapCursorInformationsModel; // the information about the map at the cursor's location
}
