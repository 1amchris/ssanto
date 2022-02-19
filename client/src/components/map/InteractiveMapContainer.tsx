import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectMap, updateClickedCoord } from '../../store/reducers/map';
import { MapContainer, useMapEvents } from 'react-leaflet';
import Layers from './LayerControl';
import L from 'leaflet';

function InteractiveMapContainer({ className, style }: any) {
  const { location, zoom } = useAppSelector(selectMap);
  const dispatch = useAppDispatch();

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        dispatch(updateClickedCoord({ lat: e.latlng.lat, long: e.latlng.lng }));
      },
    });
    return null;
  };

  return (
    <MapContainer
      key={JSON.stringify([location.lat, location.long])}
      center={[location.lat, location.long]}
      crs={L.CRS.EPSG3857}
      zoom={zoom}
      className={className}
      style={{ ...style }}
    >
      <Layers />
      <MapEvents />
    </MapContainer>
  );
}

export default InteractiveMapContainer;
