import L, { LatLng } from 'leaflet';
import { MapContainer, Marker, useMapEvents } from 'react-leaflet';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { selectMap } from 'store/reducers/map';
import { call } from 'store/reducers/server';
import LayersGroups from 'components/map/LayersGroups';
import ServerCallTargets from 'enums/ServerCallTargets';
import CallModel from 'models/server-coms/CallModel';
import LoadingValue from 'models/LoadingValue';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';
import React from 'react';

function InteractiveMapContainer({ className, style, id }: any) {
  const { map_center, zoom, cursor } = useAppSelector(selectMap);
  const dispatch = useAppDispatch();

  const printRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;

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
      id={id}
      key={map_center.lat + map_center.long}
      center={[map_center.lat, map_center.long]}
      crs={L.CRS.EPSG3857}
      zoom={zoom}
      className={className}
      style={{ ...style }}
      whenCreated={map => {
        new SimpleMapScreenshoter({
          mimeType: 'image/jpeg',
        }).addTo(map);
      }}
    >
      <MapEvents />
      <LayersGroups />
      {cursor && <Marker position={new LatLng(cursor.lat, cursor.long)} />}
    </MapContainer>
  );
}

export default InteractiveMapContainer;
