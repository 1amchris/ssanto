import React, { useEffect, useRef, useState } from 'react'
import { useMapEvents, useMap, TileLayer, LayersControl, GeoJSON, Circle  } from 'react-leaflet'
import WY from '../data/Wyoming.json'
import MT from '../data/Montana.json'
import ND from '../data/NorthDakota.json'
import ev from '../data/espace_vert.json'
import ts from '../data/terrain_sport_ext.json'
import { GeoJsonObject } from 'geojson'
import L, { LatLngExpression } from 'leaflet'
import icon from '../img/close.png'
import { LayerService } from './LayerService'



const Layers = () => {

    const [borderData, setBorderData] = useState([ts])
    const layerService = new LayerService()

      const map = useMapEvents({
          // Use leaflet map event as the key and a call back with the 
          // map method as the value:
          zoomend: () => {
            // Get the zoom level once zoom ended:
            console.log(map.getZoom())
          },
          moveend: () => {
          // Get bounds once move has ended:
            console.log(map.getBounds())
          }
        })
        const mapRef = useRef();

        function displayLayers() {
          console.log(layerService.activeLayers);
          Object.entries(layerService.activeLayers).map( ([name,layer])  =>{
            console.log("layer", layer);
            return(
            <LayersControl.Overlay checked name={name}>
              <Circle
                  center={layer as LatLngExpression}
                  pathOptions={{ fillColor: "green" }}
                  radius={1000}
                />
          </LayersControl.Overlay>)
  
        })
          

        }


        useEffect(() => {
            const { current = {} } = mapRef;
        
            if ( !map ) return;
        
            const parkIcon = new L.Icon({
              iconUrl: icon,
              iconSize: [5, 5],
              popupAnchor: [0, -15],
              shadowAnchor: [13, 28]
            });
        
            const parksGeojson = new L.GeoJSON(ts as GeoJsonObject, {
              pointToLayer: (feature, latlng) => {
                return L.marker(latlng, {
                  icon: parkIcon
                });
              },
              onEachFeature: (feature , layer) => {
                const { properties = {} } = feature;
                const { Name } = properties;
        
                if ( !Name ) return;
        
                layer.bindPopup(`<p>${Name}</p>`);
              }
            });
            /*parksGeojson.addTo(map);*/
        

          }, [])
      
return (
  <>  
    <LayersControl position="bottomleft">

    {
          Object.entries(layerService.activeLayers).map( ([name,layer])  =>{
            console.log("layer", layer);
            return(
            <LayersControl.Overlay checked name={name}>
              <Circle
                  center={layer as LatLngExpression}
                  pathOptions={{ fillColor: "green" }}
                  radius={1000}
                />
          </LayersControl.Overlay>)
  
        })
          

        }

    </LayersControl>

  </>

)
}

export default Layers

