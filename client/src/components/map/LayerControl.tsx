import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import { TileLayer, LayersControl, GeoJSON } from 'react-leaflet';
import { Layer, selectMap } from 'store/reducers/map';
import { useAppSelector } from 'store/hooks';

const Layers = ({ t }: any) => {
  const { layers } = useAppSelector(selectMap);

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

      {layers.map(({ identifier, label, name, data }: Layer) => (
        <LayersControl.Overlay
          key={identifier}
          name={capitalize(t(label || name))}
          checked
        >
          <GeoJSON data={data} />
        </LayersControl.Overlay>
      ))}
    </LayersControl>
  );
};

export default withTranslation()(Layers);
