import { withTranslation } from "react-i18next";

//Importation des données à effacer, juste pour démo
import ev from "../data/espace_vert.json";
import lh from "../data/limite_h.json";


import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  updateLocation,
  updateCellSize,
  updateZoom,
  addLayer,
  selectmap,
  updateClickedCoord,
  Layer,
} from "../store/reducers/map";
import {
  MapContainer, useMapEvents,
} from "react-leaflet";
import Layers from "./LayerControl";
import L from "leaflet";

export default withTranslation()(function InteractiveMapContainer({ t }: any) {
  const map = useAppSelector(selectmap);

  const dispatch = useAppDispatch();



  const MapEvents = () => {
    useMapEvents({
      click(e) {
        dispatch(updateClickedCoord([e.latlng.lat, e.latlng.lng]));
      },
    });
    return (<></>);
}


  //À enlever après le binding
  let nb = 1;

  let tempLong = map.location[1];
  let tempLat = map.location[0];
  const handleTempLong = (event: { target: { value: any } }) => {
    tempLong = event.target.value;
  };
  const handleTempLat = (event: { target: { value: any } }) => {
    tempLat = event.target.value;
  };

  //Fonction à effacer, juste pour démo

  const changeLayer = (nb: number) => (_event: any) => {
    switch (nb) {
      case 1:
        let l1: Layer = { name: "layer1", data: ev };
        dispatch(addLayer(l1));
        break;
      case 2:
        let l2: Layer = { name: "layer2", data: lh };
        dispatch(addLayer(l2));
        break;
      case 3:
        let l3: Layer = { name: "layer3", data: ""};
        dispatch(addLayer(l3));
        break;
      case 4:
        let l4: Layer = { name: "layer4", data: "" };
        dispatch(addLayer(l4));
        break;
      default:
        console.log("no more layers");
    }
    nb += 1;
  };

  return (
    <div>
      <h1>Welcome Bitches!</h1>
      <MapContainer
        key={JSON.stringify([map.location[0], map.location[1], map.zoom])}
        center={map.location}
        zoom={map.zoom}
        scrollWheelZoom={false}
        style={{ height: "600px", width: "600px" }}
      >
        <Layers />
        <MapEvents />
      </MapContainer>

      <button onClick={() => dispatch(updateZoom(10))}>move location</button>

      <label htmlFor="long_input">Long:</label>
      <input
        onChange={handleTempLong}
        type="text"
        id="long_input"
        name="long_input"
        required
      />
      <label htmlFor="lat_input">Lat:</label>
      <input
        onChange={handleTempLat}
        type="text"
        id="lat_input"
        name="lat_input"
        required
      />

      <button onClick={() => dispatch(updateLocation([tempLat, tempLong]))}>
        Update map center
      </button>
      <span className="badge bg-primary mx-2">{map.cellSize}</span>
      <button onClick={changeLayer(1)}>Add a layer 1</button>
      <button onClick={changeLayer(2)}>Add a layer 2</button>
      <p>Lat: {map.clickedCoord[0]} Long: {map.clickedCoord[1]}</p>

    </div>
  );
});
