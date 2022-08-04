import React from 'react';
import L from 'leaflet';
import {
  LayersControl,
  MapContainer,
  TileLayer,
  LayerGroup,
  GeoJSON,
  useMapEvents,
} from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import ColorsUtils from 'utils/colors-utils';
import { useAppDispatch } from 'store/hooks';
import { call } from 'store/reducers/server';
import ServerCallTarget from 'enums/ServerCallTarget';
import CallModel from 'models/server-coms/CallModel';

// TODO: Remove me. This is custom, and will fail for any normal geojson. It's a hack, but all if any information should be accessible/customizable/idk
const style = (feature: any) => {
  if (feature?.properties?.suitability >= 0) {
    const color = ColorsUtils.greenToRed(feature.properties.suitability);
    return {
      color: color,
      fillColor: color,
      fillOpacity: 0.65,
      weight: 0.35,
    };
  } else if (feature?.properties?.suitability < 0) {
    return { color: '#00000000', fillOpacity: 0 };
  } else if (feature?.properties?.suitability !== undefined) {
    return { color: '#0000ff', fillOpacity: 0 };
  } else {
    return {};
  }
};

function GeoJsonMap({ view }: any) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { content, uri } = view;

  const publishChanges = (key: string, data: any) => {
    dispatch(
      call({
        target: ServerCallTarget.WorkspaceViewsPublishEvent,
        args: [uri, { [key]: data }],
      } as CallModel)
    );
  };

  const MapEvents = () => {
    useMapEvents({
      zoomend: e => {
        const { lat, lng: long } = e.target.getCenter();
        publishChanges('coords', {
          center: { lat, long },
          zoom: e.target.getZoom(),
        });
      },
      dragend: e => {
        const { lat, lng: long } = e.target.getCenter();
        publishChanges('coords', {
          center: { lat, long },
          zoom: e.target.getZoom(),
        });
      },
    });
    return null;
  };

  return (
    <MapContainer
      crs={L.CRS.EPSG3857}
      style={{
        width: '100%',
        height: '100%',
      }}
      center={[content.coords?.center.lat, content.coords?.center.long]}
      zoom={content.coords?.zoom}
      bounds={
        content.coords === undefined
          ? [
              [content.bounds[0].lat, content.bounds[0].long],
              [content.bounds[1].lat, content.bounds[1].long],
            ]
          : undefined
      }
    >
      <MapEvents />
      <LayersControl position="bottomleft">
        <LayersControl.BaseLayer name={t('osm')} checked>
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name={t('none')}>
          <TileLayer url="" />
        </LayersControl.BaseLayer>
        <LayerGroup>
          <GeoJSON data={content.geojson} style={style} />
        </LayerGroup>
      </LayersControl>
    </MapContainer>
  );
}

export default GeoJsonMap;
