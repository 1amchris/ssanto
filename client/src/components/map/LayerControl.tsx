import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import { TileLayer, LayersControl, GeoJSON } from 'react-leaflet';
import { Layer, selectMap } from 'store/reducers/map';
import { useAppSelector } from 'store/hooks';
import { GeoFile, selectAnalysis } from 'store/reducers/analysis';

const defaultData: GeoJSON.Feature = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [],
  },
  properties: {},
};

const Layers = ({ t }: any) => {
  const { layers } = useAppSelector(selectMap);
  const {
    geodatabase: { files },
  } = useAppSelector(selectAnalysis);

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

      {files
        ?.filter((file: GeoFile, index: number) => file.data != undefined)
        .map((file: GeoFile, index: number) => (
          <LayersControl.Overlay
            key={index}
            name={capitalize(t(file.name))}
            checked
          >
            <GeoJSON data={file.data ? file.data : defaultData} />
          </LayersControl.Overlay>
        ))}
    </LayersControl>
  );
};

export default withTranslation()(Layers);
