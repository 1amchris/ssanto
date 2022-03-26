import { uniqueId } from 'lodash';
import { Layer, Layers, LayersGroups } from '../models/map/Layers';
import { InsertLayerModel } from '../models/map/InsertLayerModel';
import { RemoveLayerModel } from '../models/map/RemoveLayerModel';

namespace LayersUtils {
  const DEFAULT_GROUP = 'default';

  export function add(
    layersGroups: LayersGroups,
    layer: InsertLayerModel
  ): LayersGroups {
    const group = layer.group || DEFAULT_GROUP;

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

  export function remove(
    layersGroups: LayersGroups,
    layer: RemoveLayerModel
  ): LayersGroups {
    const { name, group } = {
      group: DEFAULT_GROUP,
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

export default LayersUtils;
