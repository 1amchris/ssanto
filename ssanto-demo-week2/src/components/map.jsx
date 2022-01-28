import React, { Component } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  FeatureGroup,
  Polygon,
} from "react-leaflet";
import $ from "jquery";

class Map extends Component {
  state = {
    countriesFileUrl: "data/countries.geojson",
    usStatesFileUrl: "data/usa/states.geojson",
    usCountiesFileUrl: "data/usa/counties.geojson",
    countries: null,
    usStates: null,
    usCounties: null,
  };

  render() {
    const { position, zoom } = this.props;
    const { countries, usStates, usCounties } = this.state;
    return (
      <MapContainer center={position} zoom={zoom} style={{ height: "90vh" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {this.props.show.countries && countries?.map(this.getCountryPolygon)}
        {this.props.show.usStates && usStates?.map(this.getUSStatePolygon)}
        {this.props.show.usCounties &&
          usCounties?.map(this.getUSCountiesPolygon)}
      </MapContainer>
    );
  }

  componentDidMount() {
    this.loadGeoJson("countries", this.state.countriesFileUrl);
    this.loadGeoJson("usStates", this.state.usStatesFileUrl);
    this.loadGeoJson("usCounties", this.state.usCountiesFileUrl);
  }

  loadGeoJson(property, url) {
    $.ajax({
      dataType: "json",
      url: url,
      success: (data) => {
        const newState = {};
        newState[property] = data.features;
        this.setState(newState);
      },
      error: console.error,
    });
  }

  getPositions(coordinates, shapeType) {
    return coordinates.map((p) =>
      shapeType === "Polygon"
        ? p.map(([lng, lat]) => [lat, lng])
        : shapeType === "MultiPolygon"
        ? p.map((q) => q.map(([lng, lat]) => [lat, lng]))
        : console.warn(`Unsupported geometry type: ${shapeType}`) | []
    );
  }

  getCountryPolygon = ({
    geometry: { coordinates, type },
    properties: { ADMIN },
  }) => (
    <FeatureGroup key={`country?${ADMIN}`}>
      <Popup>{ADMIN}</Popup>
      <Polygon
        positions={this.getPositions(coordinates, type)}
        pathOptions={{
          weight: 1,
          fillOpacity: 0,
        }}
      />
    </FeatureGroup>
  );

  getUSStatePolygon = ({
    geometry: { coordinates, type },
    properties: { GEO_ID, NAME },
  }) => (
    <FeatureGroup key={GEO_ID}>
      <Popup>{NAME}</Popup>
      <Polygon
        positions={this.getPositions(coordinates, type)}
        pathOptions={{
          color: "green",
          weight: 1,
          dashOffset: "10",
          fillOpacity: 0,
        }}
      />
    </FeatureGroup>
  );

  getUSCountiesPolygon = ({
    geometry: { coordinates, type },
    properties: { GEO_ID, NAME },
  }) => (
    <FeatureGroup key={GEO_ID}>
      <Popup>{NAME}</Popup>
      <Polygon
        positions={this.getPositions(coordinates, type)}
        pathOptions={{
          color: "red",
          weight: 1,
          fillOpacity: 0,
        }}
      />
    </FeatureGroup>
  );
}

export default Map;
