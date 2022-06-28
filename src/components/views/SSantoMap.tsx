import React from 'react';
import L, { LatLng } from 'leaflet';
import {
  LayersControl,
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'store/hooks';
import { call } from 'store/reducers/server';
import ServerCallTarget from 'enums/ServerCallTarget';
import CallModel from 'models/server-coms/CallModel';
// import LayersGroups from 'components/map/LayersGroups';
// import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';

function SSantoMap({ view }: any) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const publishChanges = (key: string, data: any) => {
    dispatch(
      call({
        target: ServerCallTarget.WorkspaceViewsPublishChanges,
        args: [
          uri,
          {
            [key]: data,
          },
        ],
      } as CallModel)
    );
  };

  const {
    uri,
    content: { map },
  } = view;

  const MapEvents = () => {
    useMapEvents({
      baselayerchange: e => {
        publishChanges('map.layers.base', e.name);
      },
      zoomend: e => {
        publishChanges('map.coords.zoom', e.target.getZoom());
      },
      dragend: e => {
        const { lat, lng: long } = e.target.getCenter();
        publishChanges('map.coords.center', { lat, long });
      },
      click: e => {
        publishChanges('map.lastClickCoords', {
          lat: e.latlng.lat,
          long: e.latlng.lng,
        });
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={[map?.coords?.center?.lat || 0, map?.coords?.center?.long || 0]}
      zoom={map?.coords?.zoom || 1}
      minZoom={1}
      crs={L.CRS.EPSG3857}
      style={{
        width: '100%',
        height: '100%',
      }}
      // whenCreated={map => {
      //   new SimpleMapScreenshoter({
      //     mimeType: 'image/jpeg',
      //   }).addTo(map);
      // }}
    >
      <MapEvents />
      <LayersControl position="bottomleft">
        <LayersControl.BaseLayer
          name={t('osm')}
          checked={map?.layers?.base === 'street'}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer
          name={t('none')}
          checked={map?.layers?.base !== 'street'}
        >
          <TileLayer url="" />
        </LayersControl.BaseLayer>
      </LayersControl>

      {map.lastClickCoords && (
        <Marker
          position={
            new LatLng(map.lastClickCoords.lat, map.lastClickCoords.long)
          }
        />
      )}
    </MapContainer>
  );
}

export default SSantoMap;
