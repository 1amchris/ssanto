import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import { TileLayer, LayersControl, GeoJSON, LayerGroup } from 'react-leaflet';
import { removeLayer, selectMap, upsertLayer } from 'store/reducers/map';
import { Layer, Layers, LayersUpdateGroups } from 'models/map/Layers';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useEffect, useRef } from 'react';
import ServerCallTargets from 'enums/ServerCallTargets';
import { call } from 'store/reducers/server';
import CallModel from 'models/server-coms/CallModel';
import { InsertLayerModel } from 'models/map/InsertLayerModel';
import { RemoveLayerModel } from 'models/map/RemoveLayerModel';
import ColorScaleUtils from 'utils/color-scale-utils';

const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const LayersGroups = ({ t }: any) => {
  const { layers, update_layers } = useAppSelector(selectMap);
  const dispatch = useAppDispatch();

  const style = (feature: any) => {
    if (
      feature.properties !== undefined &&
      feature.properties.sutability >= 0
    ) {
      let color = ColorScaleUtils.greenToRed(feature.properties.sutability);
      return {
        color: color,
        fillColor: color,
        fillOpacity: 0.65,
        // the fillColor is adapted from a property which can be changed by the user (segment)
        //fillColor: 'black',
        //weight: 0.3,
        //stroke-width: to have a constant width on the screen need to adapt with scale
        //opacity: 1,
        //color: 'black',
        //dashArray: '3',
        //fillOpacity: 0.5,
        weight: 0.35,
      };
    } else if (
      feature.properties !== undefined &&
      feature.properties.sutability < 0
    ) {
      return { color: '#00000000', fillOpacity: 0 };
    } else {
      return { color: '#0000ff', fillOpacity: 0 };
    }
  };

  const prevUpdateLayers: LayersUpdateGroups | undefined =
    usePrevious(update_layers);
  useEffect(() => {
    if (prevUpdateLayers == undefined) return;
    let p: LayersUpdateGroups = prevUpdateLayers;

    let new_pairs: string[][] = [];
    let old_pairs: string[][] = [];

    for (let [group, names] of Object.entries(update_layers)) {
      for (let name of names) {
        new_pairs.push([group, name]);
      }
    }

    for (let [group, names] of Object.entries(prevUpdateLayers as any)) {
      for (let name of names as any) {
        old_pairs.push([group, name]);
      }
    }

    let toAdd: string[][] = new_pairs.filter((x: string[]) => {
      if (p[x[0]]) return !p[x[0]].includes(x[1]);
      else return true;
    });
    let toRemove: string[][] = old_pairs.filter((x: string[]) => {
      if (update_layers[x[0]]) return !update_layers[x[0]].includes(x[1]);
      else return true;
    });

    for (let layer of toAdd) {
      dispatch(
        call({
          target: ServerCallTargets.GetLayer,
          args: [layer[0], layer[1]],
          onSuccessAction: upsertLayer,
        } as CallModel<string[], InsertLayerModel, void, void, void>)
      );
    }

    for (let layer of toRemove) {
      dispatch(
        removeLayer({
          group: layer[0],
          name: layer[1],
        } as RemoveLayerModel)
      );
    }
  }, [prevUpdateLayers, update_layers]);
  return (
    <LayersControl position="bottomleft">
      <LayersControl.BaseLayer checked name={capitalize(t('osm'))}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name={capitalize(t('none'))}>
        <TileLayer url="" />
      </LayersControl.BaseLayer>
      {Object.entries(layers).map(([group, layers]: [string, Layers]) => (
        <LayerGroup
          key={`${group}/${Object.keys(layers).reduce(
            (prev, curr) => prev + curr
          )}`}
        >
          {Object.entries(layers).map(([name, layer]: [string, Layer]) => (
            <LayersControl.Overlay
              checked={layer.activated as boolean}
              name={capitalize(t(layer.label || name))}
              key={layer.identifier}
            >
              <GeoJSON data={layer.geojson} style={style} />
            </LayersControl.Overlay>
          ))}
        </LayerGroup>
      ))}
    </LayersControl>
  );
};

export default withTranslation()(LayersGroups);