import React from 'react';
import L, { LatLng } from 'leaflet';
import { MapContainer, Marker, useMapEvents } from 'react-leaflet';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { selectMap } from 'store/reducers/map';
import { call } from 'store/reducers/server';
import LayersGroups from 'components/map/LayersGroups';
import ServerCallTarget from 'enums/ServerCallTarget';
import CallModel from 'models/server-coms/CallModel';
import LoadingValue from 'models/LoadingValue';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';

/**
 * Interactive map container component.
 * @param {any} param0 Parameters for the interactive map container.
 * @return {JSX.Element} Html.
 */
function InteractiveMapContainer({ className, style, id }: any) {
  const { map_center: mapCenter, zoom, cursor } = useAppSelector(selectMap);
  const dispatch = useAppDispatch();

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        dispatch(
          call({
            target: ServerCallTarget.GetCellSuitability,
            args: [{ lat: e.latlng.lat, long: e.latlng.lng }],
          } as CallModel<[Object], void, LoadingValue<string>, string, string>)
        );
        dispatch(
          call({
            target: ServerCallTarget.MapSetCursor,
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
      key={mapCenter.lat + mapCenter.long}
      center={[mapCenter.lat, mapCenter.long]}
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
