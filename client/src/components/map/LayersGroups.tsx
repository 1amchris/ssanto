import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import { TileLayer, LayersControl, GeoJSON, LayerGroup } from 'react-leaflet';
import { selectMap } from 'store/reducers/map';
import { Layer, Layers } from 'models/map/Layers';
import { useAppSelector } from 'store/hooks';

const LayersGroups = ({ t }: any) => {
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
    } else if (
      feature.properties !== undefined &&
      feature.properties.sutability === 0
    ) {
      return { color: '#00000000', fillOpacity: 0 };
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
      {Object.entries(layers).map(([group, layers]: [string, Layers]) => (
        <LayerGroup
          key={`${group}/${Object.keys(layers).reduce(
            (prev, curr) => prev + curr
          )}`}
        >
          {Object.entries(layers).map(([name, layer]: [string, Layer]) => (
            <LayersControl.Overlay
              checked
              name={capitalize(t(layer.label || name))}
              key={layer.identifier}
            >
              <GeoJSON data={layer.geojson} style={style} />
            </LayersControl.Overlay>
          ))}
        </LayerGroup>
      ))}
    </LayersControl>
  );
};

export default withTranslation()(LayersGroups);
