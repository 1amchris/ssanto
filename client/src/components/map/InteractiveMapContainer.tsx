import { withTranslation } from 'react-i18next';

import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  updateLocation,
  addLayer,
  selectMap,
  updateClickedCoord,
  Layer,
} from '../../store/reducers/map';
import { MapContainer, useMapEvents } from 'react-leaflet';
import Layers from './LayerControl';
import L from 'leaflet';
import React, { useState } from 'react';

function InteractiveMapContainer({ t, className, style }: any) {
  const {
    location: locationJSON,
    clickedCoord,
    zoom,
  } = useAppSelector(selectMap);
  const dispatch = useAppDispatch();

  const location = JSON.parse(locationJSON);
  const [{ long: tempLong, lat: tempLat }, setTempLongLat] = useState(
    location as { long: string; lat: string }
  );

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        dispatch(updateClickedCoord({ lat: e.latlng.lat, long: e.latlng.lng }));
      },
    });
    return null;
  };

  

  return (
    // <React.Fragment>
    //     <label htmlFor="long_input">Long:</label>
    //     <input
    //       onChange={({ target: { value } }: any) =>
    //         setTempLongLat({ long: value, lat: tempLat })
    //       }
    //       type="text"
    //       id="long_input"
    //       name="long_input"
    //       value={tempLong}
    //       required
    //     />
    //     <label htmlFor="lat_input">Lat:</label>
    //     <input
    //       onChange={({ target: { value } }: any) => {
    //         setTempLongLat({ long: tempLong, lat: value });
    //       }}
    //       type="text"
    //       id="lat_input"
    //       name="lat_input"
    //       value={tempLat}
    //       required
    //     />

    //     <button
    //       onClick={() =>
    //         dispatch(updateLocation({ long: +tempLong, lat: +tempLat }))
    //       }
    //     >
    //       Update map center
    //     </button>
    //     <button onClick={changeLayer(1)}>{t('Add a layer 1')}</button>
    //     <button onClick={changeLayer(2)}>{t('Add a layer 2')}</button>
    //     <p>Store baked coords: {clickedCoord}</p>

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
    // </React.Fragment>
  );
}

export default withTranslation()(InteractiveMapContainer);
