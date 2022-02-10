import { TileLayer, LayersControl, GeoJSON } from 'react-leaflet';
import { useAppSelector } from '../../store/hooks';
import { selectMap } from '../../store/reducers/map';

const Layers = () => {
  const layers = useAppSelector(selectMap).layers;

  return (
    <LayersControl position="bottomleft">
      <LayersControl.Overlay checked name="osm">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </LayersControl.Overlay>

      {Object.entries(layers).map(layer => {
        const { name, data } = JSON.parse(layer[1]);
        return (
          <LayersControl.Overlay key={name} checked name={name}>
            <GeoJSON data={data} />
          </LayersControl.Overlay>
        );
      })}
    </LayersControl>
  );
};

export default Layers;
