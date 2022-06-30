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
// import ColorsUtils from 'utils/colors-utils';
// import LayersGroups from 'components/map/LayersGroups';
// import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';

// const style = (feature: any) => {
//   if (feature.properties !== undefined && feature.properties.sutability >= 0) {
//     const color = ColorsUtils.greenToRed(feature.properties.sutability);
//     return {
//       color: color,
//       fillColor: color,
//       fillOpacity: 0.65,
//       weight: 0.35,
//     };
//   } else if (
//     feature.properties !== undefined &&
//     feature.properties.sutability < 0
//   ) {
//     return { color: '#00000000', fillOpacity: 0 };
//   } else {
//     return { color: '#0000ff', fillOpacity: 0 };
//   }
// };

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
      overlayadd: e => {
        // publishChanges(`map.layers.overlays.${e.name}`);
        console.log('overlayadd', e);
      },
      overlayremove: e => {
        console.log('overlayremove', e);
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
          key={`${uri}-${map?.studyArea?.geojson}`}
          // key={`${group}/${Object.keys(layers).reduce(
          //   (prev, curr) => prev + curr
          // )}`}
        >
          {/* {Object.entries(layers).map(([name, layer]: [string, Layer]) => ( */}
          <LayersControl.Overlay
            checked={map?.studyArea?.checked != false}
            name={map?.studyArea?.name}
          >
            {/* <GeoJSON data={layer.geojson}  /> */}
            <GeoJSON data={map?.studyArea?.geojson} />
          </LayersControl.Overlay>
          {/* ))} */}
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
