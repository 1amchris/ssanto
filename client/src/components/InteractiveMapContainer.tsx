
import { GeoJsonObject, Point } from "geojson";
import L from "leaflet";
import React, { RefAttributes } from "react";
 import { MapContainer, TileLayer, Marker, Popup, GeoJSON, ZoomControl, LayersControl } from "react-leaflet";
 import ev from "../data/terrain_sport_ext.json";
 import sh from "../data/test.json"
 import Layers from './LayerControl'


/* addLayer(), removeLayer() */
 
 class InteractiveMapContainer extends React.Component {

    state = {
        geoJSON: null,
        reference: null,
      };

    countryStyle = {
        fillColor: "red",
        fillOpacity: 1,
        color: "black",
        weight: 2,
      }
      simpleGeojson = JSON. stringify ({
        "geometry": {
            "type": "Point",
            "coordinates": [-73.97341,40.7709]
        }

      })

      geojsonFeature = JSON. stringify({
        "type": "Feature",
        "properties": {
            "name": "Coors Field",
            "amenity": "Baseball Stadium",
            "popupContent": "This is where the Rockies play!"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [40.7709, -73.9734]
        }
    });
    
    defaultCenter: L.LatLngExpression = [40.7709, -73.9734]
    centerMTL: L.LatLngExpression = [45.509, -73.553]
    otherTest: L.LatLngExpression = [37.0902, -95.7129]

    parkData = sh
    loadPark() {
        console.log("loading parks");

    };
        


      
      render() {
     return (
       <div>
         <h1>Welcome Bitches!</h1>
         <button onClick={this.loadPark}> Add parks</button>
         <MapContainer
           center={this.centerMTL}
           zoom={10}
           scrollWheelZoom={false}
           style={{ height: "600px", width: "600px" }}
         >

        <TileLayer
  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

        <Layers />



         </MapContainer>

     
       </div>
     );
   }


 }
 export default InteractiveMapContainer;