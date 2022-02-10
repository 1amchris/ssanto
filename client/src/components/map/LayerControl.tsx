import { TileLayer, LayersControl, GeoJSON } from 'react-leaflet';
import { useAppSelector } from '../../store/hooks';
import { Layer, selectMap } from '../../store/reducers/map';

const Layers = () => {
  const { layers } = useAppSelector(selectMap);

  return (
    <LayersControl position="bottomleft">
      <LayersControl.BaseLayer checked name="Street">
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="None">
        <TileLayer url="" />
      </LayersControl.BaseLayer>

      {layers.map(({ name, data }: Layer) => (
        <LayersControl.Overlay key={name} name={name} checked>
          <GeoJSON data={data} />
        </LayersControl.Overlay>
      ))}
    </LayersControl>
  );
};

export default Layers;
