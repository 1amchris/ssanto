import React, { useEffect, useState } from 'react';
import L, { LatLng } from 'leaflet';
import {
  LayersControl,
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  LayerGroup,
  GeoJSON,
  Popup,
} from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { call } from 'store/reducers/server';
import ServerCallTarget from 'enums/ServerCallTarget';
import CallModel from 'models/server-coms/CallModel';
import ColorsUtils from 'utils/colors-utils';
import useBlobber from 'hooks/useBlobber';
import { selectBlobber } from 'store/reducers/blobber';

const style = (feature: any) => {
  if (feature.properties !== undefined && feature.properties.suitability >= 0) {
    const color = ColorsUtils.greenToRed(feature.properties.suitability);
    return {
      color: color,
      fillColor: color,
      fillOpacity: 0.65,
      weight: 0.35,
    };
  } else if (
    feature.properties !== undefined &&
    feature.properties.suitability < 0
  ) {
    return { color: '#00000000', fillOpacity: 0 };
  } else {
    return { color: '#0000ff', fillOpacity: 0 };
  }
};

const GeoJsonLayer = ({
  blob,
  checked,
}: {
  blob: string;
  checked: boolean;
}) => {
  const [data, setData] = useState<any | null>(null);
  const { getBlob } = useBlobber();

  useEffect(() => {
    setData(getBlob(blob));
  }, []);

  return checked && data !== null ? (
    <GeoJSON data={data} style={style} />
  ) : (
    <LayerGroup />
  );
};

function SSantoMap({ view }: any) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { blobs } = useAppSelector(selectBlobber);

  const publishChanges = (key: string, data: any) => {
    dispatch(
      call({
        target: ServerCallTarget.WorkspaceViewsPublishEvent,
        args: [
          uri,
          {
            [key]: data,
          },
        ],
      } as CallModel)
    );
  };

  const {
    uri,
    content: { map },
  } = view;

  const findLayerByName = (name: string, source: object) => {
    const possibles = Object.entries(source)
      .filter(([, layer]) => (layer as any).name === name)
      .map(([key]) => key);

    return possibles.length > 0 ? possibles[0] : null;
  };

  const MapCreated = (map: any) => {};

  const MapEvents = () => {
    useMapEvents({
      baselayerchange: e => {
        publishChanges('map.layers.base', e.name);
      },
      overlayadd: e => {
        // For lack of a better way to do this, we'll just find it using it's name
        const overlayId = findLayerByName(e.name, map!.layers!.overlays);
        if (overlayId !== null) {
          publishChanges(`map.layers.overlays.${overlayId}.checked`, true);
          return;
        }

        const resultId = findLayerByName(e.name, map!.layers!.results);
        if (resultId !== null) {
          publishChanges(`map.layers.results.${resultId}.checked`, true);
          return;
        }

        console.warn(
          `Could not find layer ${e.name}. Couldn't publish changes`
        );
      },
      overlayremove: e => {
        // For lack of a better way to do this, we'll just find it using it's name
        const overlayId = findLayerByName(e.name, map!.layers!.overlays);
        if (overlayId !== null) {
          publishChanges(`map.layers.overlays.${overlayId}.checked`, false);
          return;
        }

        const resultId = findLayerByName(e.name, map!.layers!.results);
        if (resultId !== null) {
          publishChanges(`map.layers.results.${resultId}.checked`, false);
          return;
        }

        console.warn(
          `Couldn't find layer "${e.name}". Failed to publish changes`
        );
      },
      zoomend: e => {
        publishChanges('map.coords.zoom', e.target.getZoom());
      },
      dragend: e => {
        const { lat, lng: long } = e.target.getCenter();
        publishChanges('map.coords.center', { lat, long });
      },
      click: e => {
        publishChanges('map.lastClick.coords', {
          lat: e.latlng.lat,
          long: e.latlng.lng,
        });
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={[map?.coords?.center?.lat || 0, map?.coords?.center?.long || 0]}
      zoom={map?.coords?.zoom || 1}
      minZoom={1}
      crs={L.CRS.EPSG3857}
      style={{
        width: '100%',
        height: '100%',
      }}
      whenCreated={MapCreated}
    >
      <MapEvents />
      <LayersControl position="bottomleft">
        <LayersControl.BaseLayer
          name={t('osm')}
          checked={map?.layers?.base === 'street'}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer
          name={t('none')}
          checked={map?.layers?.base !== 'street'}
        >
          <TileLayer url="" />
        </LayersControl.BaseLayer>
        <LayerGroup
          key={`${uri}-${JSON.stringify(map?.layers?.overlays || {})}`}
        >
          {Object.values(map?.layers?.overlays || {})
            .sort((overlay: any) => overlay.name.toLowerCase())
            .map((overlay: any, index: number) => (
              <LayersControl.Overlay
                key={`${uri}-${index}-${JSON.stringify(overlay)}`}
                checked={overlay.checked != false}
                name={overlay.name}
              >
                <GeoJsonLayer
                  key={JSON.stringify(blobs[overlay.geojson])}
                  blob={overlay.geojson as string}
                  checked={overlay.checked}
                />
              </LayersControl.Overlay>
            ))}
        </LayerGroup>
        <LayerGroup
          key={`${uri}-${JSON.stringify(map?.layers?.results || {})}`}
        >
          {Object.values(map?.layers?.results || {})
            .sort((overlay: any) => overlay.name.toLowerCase())
            .map((overlay: any, index: number) => (
              <LayersControl.Overlay
                key={`${uri}-${index}-${JSON.stringify(overlay)}`}
                checked={overlay.checked != false}
                name={overlay.name}
              >
                <GeoJsonLayer
                  key={JSON.stringify(blobs[overlay.geojson])}
                  blob={overlay.geojson}
                  checked={overlay.checked}
                />
              </LayersControl.Overlay>
            ))}
        </LayerGroup>
      </LayersControl>

      {map.lastClick.coords && (
        <Marker
          position={
            new LatLng(map.lastClick.coords.lat, map.lastClick.coords.long)
          }
        >
          {
            <Popup closeButton={false} closeOnEscapeKey closeOnClick>
              {(map.lastClick.meta && (
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Layer</th>
                      <th>Suitability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(map.lastClick.meta)
                      .map(([key, value]: any) => {
                        return {
                          layer: key.substring(key.lastIndexOf('.') + 1),
                          value: value.toPrecision(2),
                        };
                      })
                      .sort((a, b) => a.layer.localeCompare(b.layer))
                      .map(({ layer, value }: any) => (
                        <tr key={layer}>
                          <td>{layer}</td>
                          <td>{value}%</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )) ||
                (!map.lastClick.meta &&
                  'Data is currently unavailable for this location')}
            </Popup>
          }
        </Marker>
      )}
    </MapContainer>
  );
}

export default SSantoMap;
