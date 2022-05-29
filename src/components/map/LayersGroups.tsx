import React from 'react';
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
import ColorUtils from 'utils/color-utils';

const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const LayersGroups = ({ t }: any) => {
  const { layers, update_layers: updateLayers } = useAppSelector(selectMap);
  const dispatch = useAppDispatch();

  const style = (feature: any) => {
    if (
      feature.properties !== undefined &&
      feature.properties.sutability >= 0
    ) {
      const color = ColorUtils.greenToRed(feature.properties.sutability);
      return {
        color: color,
        fillColor: color,
        fillOpacity: 0.65,
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
    usePrevious(updateLayers);
  useEffect(() => {
    if (prevUpdateLayers === undefined) return;
    const p: LayersUpdateGroups = prevUpdateLayers;

    const newPairs: string[][] = [];
    const oldPairs: string[][] = [];

    for (const [group, names] of Object.entries(updateLayers)) {
      for (const name of names) {
        newPairs.push([group, name]);
      }
    }

    for (const [group, names] of Object.entries(prevUpdateLayers as any)) {
      for (const name of names as any) {
        oldPairs.push([group, name]);
      }
    }

    const toAdd: string[][] = newPairs.filter((x: string[]) => {
      if (p[x[0]]) return !p[x[0]].includes(x[1]);
      else return true;
    });
    const toRemove: string[][] = oldPairs.filter((x: string[]) => {
      if (updateLayers[x[0]]) return !updateLayers[x[0]].includes(x[1]);
      else return true;
    });

    for (const layer of toAdd) {
      dispatch(
        call({
          target: ServerCallTargets.GetLayer,
          args: [layer[0], layer[1]],
          onSuccessAction: upsertLayer,
        } as CallModel<string[], InsertLayerModel, void, void, void>)
      );
    }

    for (const layer of toRemove) {
      dispatch(
        removeLayer({
          group: layer[0],
          name: layer[1],
        } as RemoveLayerModel)
      );
    }
  }, [prevUpdateLayers, updateLayers]);
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
