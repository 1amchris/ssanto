import { LayersGroups } from './Layers';
import { LatLong } from './LatLong';
import { MapCursorInformationsModel } from './MapCursorInformationsModel';
import SuitabilityCategoriesModel from './SuitabilityCategoriesModel';

export interface MapStateModel {
  location: LatLong; // the map location
  zoom: number;
  layers: LayersGroups;
  cursor?: LatLong; // the last registered position of the cursor on the map
  cursorInformations?: MapCursorInformationsModel; // the information about the map at the cursor's location
  suitabilityCategories?: SuitabilityCategoriesModel; //
  suitabilityThreshold: number; // [0, 1]
  suitabilityAboveThreshold?: number;
}
