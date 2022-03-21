import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import { TileLayer, LayersControl, GeoJSON } from 'react-leaflet';
import { Layer, selectMap } from 'store/reducers/map';
import { useAppSelector } from 'store/hooks';

const Layers = ({ t }: any) => {
  const { layers } = useAppSelector(selectMap);

  const perc2color = (perc: number) => {
    var r,
      g,
      b = 0;
    if (perc < 50) {
      r = 255;
      g = Math.round(5.1 * perc);
    } else {
      g = 255;
      r = Math.round(510 - 5.1 * perc);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
  };

  const style = (feature: any) => {
    // console.log('STYLE', feature, feature.properties);
    if (feature.properties !== undefined && feature.properties.sutability > 0) {
      let color = perc2color(feature.properties.sutability);
      return {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,

        // the fillColor is adapted from a property which can be changed by the user (segment)
        //fillColor: 'black',
        //weight: 0.3,
        //stroke-width: to have a constant width on the screen need to adapt with scale
        //opacity: 1,
        //color: 'black',
        //dashArray: '3',
        //fillOpacity: 0.5,
      };
    } else {
      return { color: '#0000ff', fillOpacity: 0 };
    }
  };
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
          <GeoJSON data={data} style={style} />
        </LayersControl.Overlay>
      ))}
    </LayersControl>
  );
};

export default withTranslation()(Layers);
