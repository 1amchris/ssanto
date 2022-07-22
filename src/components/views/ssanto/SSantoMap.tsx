import React from 'react';
import L, { LatLng } from 'leaflet';
import {
  LayersControl,
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  LayerGroup,
  GeoJSON,
} from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'store/hooks';
import { call } from 'store/reducers/server';
import ServerCallTarget from 'enums/ServerCallTarget';
import CallModel from 'models/server-coms/CallModel';
import ColorsUtils from 'utils/colors-utils';
// import LayersGroups from 'components/map/LayersGroups';
// import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';

const style = (feature: any) => {
  if (feature.properties !== undefined && feature.properties.suitability >= 0) {
    const color = ColorsUtils.greenToRed(feature.properties.suitability);
    return {
      color: color,
      fillColor: color,
      fillOpacity: 0.65,
      weight: 0.35,
    };
  } else if (
    feature.properties !== undefined &&
    feature.properties.suitability < 0
  ) {
    return { color: '#00000000', fillOpacity: 0 };
  } else {
    return { color: '#0000ff', fillOpacity: 0 };
  }
};

function SSantoMap({ view }: any) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const publishChanges = (key: string, data: any) => {
    dispatch(
      call({
        target: ServerCallTarget.WorkspaceViewsPublishEvent,
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

  const findLayerOverlayByName = (name: string) => {
    const possibles = Object.entries(map?.layers?.overlays)
      .filter(([, layer]) => (layer as any).name === name)
      .map(([key]) => key);

    return possibles.length > 0 ? possibles[0] : null;
  };

  const MapEvents = () => {
    useMapEvents({
      baselayerchange: e => {
        publishChanges('map.layers.base', e.name);
      },
      overlayadd: e => {
        // For lack of a better way to do this, we'll just find it using it's name
        const overlayId = findLayerOverlayByName(e.name);
        if (overlayId !== null) {
          publishChanges(`map.layers.overlays.${overlayId}.checked`, true);
        } else {
          console.warn(
            `Could not find layer ${e.name}. Couldn't publish changes`
          );
        }
      },
      overlayremove: e => {
        console.log('overlayadd', e);
        // For lack of a better way to do this, we'll just find it using it's name
        const overlayId = findLayerOverlayByName(e.name);
        if (overlayId !== null) {
          publishChanges(`map.layers.overlays.${overlayId}.checked`, false);
        } else {
          console.warn(
            `Couldn't find layer "${e.name}". Failed to publish changes`
          );
        }
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

  // console.log({ geojson: map.studyArea });

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
        <LayerGroup
          key={`${uri}-${JSON.stringify(map?.layers?.overlays || {})}`}
        >
          {Object.values(map?.layers?.overlays || {}).map(
            (overlay: any, index: number) => (
              <LayersControl.Overlay
                key={`${uri}-${index}-${JSON.stringify(overlay)}`}
                checked={overlay.checked != false}
                name={overlay.name}
              >
                <GeoJSON data={overlay.geojson} style={style} />
              </LayersControl.Overlay>
            )
          )}
        </LayerGroup>
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
