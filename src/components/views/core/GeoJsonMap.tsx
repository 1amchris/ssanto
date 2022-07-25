import React from 'react';
import L from 'leaflet';
import {
  LayersControl,
  MapContainer,
  TileLayer,
  LayerGroup,
  GeoJSON,
} from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import ColorsUtils from 'utils/colors-utils';

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
  const { t } = useTranslation();
  const { content: geojson } = view;

  return (
    <MapContainer
      center={[0, 0]}
      zoom={1}
      minZoom={1}
      crs={L.CRS.EPSG3857}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
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
          <GeoJSON data={geojson} style={style} />
        </LayerGroup>
      </LayersControl>
    </MapContainer>
  );
}

export default GeoJsonMap;
