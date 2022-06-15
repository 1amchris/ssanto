import React from 'react';
import L from 'leaflet';
// import L, { LatLng } from 'leaflet';
import {
  LayersControl,
  MapContainer,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import { useTranslation } from 'react-i18next';
// import { MapContainer, Marker, useMapEvents } from 'react-leaflet';
// import { useAppSelector, useAppDispatch } from 'store/hooks';
// import { selectMap } from 'store/reducers/map';
// import { call } from 'store/reducers/server';
// import LayersGroups from 'components/map/LayersGroups';
// import ServerCallTarget from 'enums/ServerCallTarget';
// import CallModel from 'models/server-coms/CallModel';
// import LoadingValue from 'models/LoadingValue';
// import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';

/**
 * Interactive map container component.
 * @param {any} param0 Parameters for the interactive map container.
 * @return {JSX.Element} Html.
 */
function Map() {
  // const { map_center: mapCenter, zoom, cursor } = useAppSelector(selectMap);
  // const dispatch = useAppDispatch();

  // const MapEvents = () => {
  //   useMapEvents({
  //     click(e) {
  //       dispatch(
  //         call({
  //           target: ServerCallTarget.GetCellSuitability,
  //           args: [{ lat: e.latlng.lat, long: e.latlng.lng }],
  //         } as CallModel<[Object], void, LoadingValue<string>, string, string>)
  //       );
  //       dispatch(
  //         call({
  //           target: ServerCallTarget.MapSetCursor,
  //           args: [e.latlng.lat, e.latlng.lng],
  //         } as CallModel<[number, number], void, void, string, string>)
  //       );
  //     },
  //   });
  //   return null;
  // };

  const { t } = useTranslation();
  // const [mapRef, setMapRef] = useState<L.Map | undefined>(undefined);
  const zoom = 10;

  function MapEvents() {
    useMapEvents({
      // zoomend: e => {
      //   console.log('zoomend', e.target.getBounds());
      //   setBounds(e.target.getBounds());
      // },
      // dragend: e => {
      //   console.log('dragend', e.target.getBounds());
      //   setBounds(e.target.getBounds());
      // },
    });
    return null;
  }

  return (
    <div className="w-100 h-100">
      {/* <button
        onClick={() =>
          mapRef?.flyToBounds(
            new L.LatLngBounds(
              { lat: 51.47143857413504, lng: -0.13561248779296878 },
              { lat: 51.526473611527514, lng: -0.008411407470703127 }
            )
          )
        }
      >
        Flyyy
      </button> */}
      <MapContainer
        center={[51.5, 0]}
        zoom={zoom}
        crs={L.CRS.EPSG3857}
        style={{
          width: '100%',
          height: '100%',
        }}
        // whenCreated={map => {
        //   // setMapRef(map);
        //   map.flyTo({ lat: 51.5, lng: -0.09 }, zoom);
        // }}
        // whenCreated={map => {
        //   new SimpleMapScreenshoter({
        //     mimeType: 'image/jpeg',
        //   }).addTo(map);
        // }}
      >
        <MapEvents />
        <LayersControl position="bottomleft">
          <LayersControl.BaseLayer checked name={t('osm')}>
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name={t('none')}>
            <TileLayer url="" />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* {cursor && <Marker position={new LatLng(cursor.lat, cursor.long)} />} */}
      </MapContainer>
    </div>
  );
}

export default Map;
