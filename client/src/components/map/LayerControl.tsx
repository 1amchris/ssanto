import { TileLayer, LayersControl, GeoJSON } from "react-leaflet";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { selectmap } from "../../store/reducers/map";

const Layers = () => {
  const dispatch = useAppDispatch();
  const layers = useAppSelector(selectmap).layers;

  return (
    <>
      <LayersControl position="bottomleft">
        <LayersControl.Overlay checked name="osm">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.Overlay>

        {Object.entries(layers).map((layer) => {
          console.log("layer", layer);
          return (
            <LayersControl.Overlay
              key={JSON.parse(layer[1]).name}
              checked
              name={JSON.parse(layer[1]).name}
            >
              <GeoJSON data={JSON.parse(layer[1]).data}> </GeoJSON>
            </LayersControl.Overlay>
          );
        })}
      </LayersControl>
    </>
  );
};

export default Layers;


