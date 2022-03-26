import L, { LatLng } from 'leaflet';
import { MapContainer, Marker, useMapEvents } from 'react-leaflet';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { selectMap } from 'store/reducers/map';
import { call } from 'store/reducers/server';
import LayersGroups from 'components/map/LayersGroups';
import ServerCallTargets from 'enums/ServerCallTargets';
import CallModel from 'models/server-coms/CallModel';
import LoadingValue from 'models/LoadingValue';

function InteractiveMapContainer({ className, style }: any) {
  const { location, zoom, cursor } = useAppSelector(selectMap);
  const dispatch = useAppDispatch();

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        dispatch(
          call({
            target: ServerCallTargets.GetCellSuitability,
            args: [{ lat: e.latlng.lat, long: e.latlng.lng }],
          } as CallModel<[Object], void, LoadingValue<string>, string, string>)
        );
        dispatch(
          call({
            target: ServerCallTargets.MapSetCursor,
            args: [e.latlng.lat, e.latlng.lng],
          } as CallModel<[number, number], void, void, string, string>)
        );
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
      <MapEvents />
      <LayersGroups />
      {cursor && <Marker position={new LatLng(cursor.lat, cursor.long)} />}
    </MapContainer>
  );
}

export default InteractiveMapContainer;
