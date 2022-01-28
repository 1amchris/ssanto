import React, { Component } from "react";
import NavBar from "./components/navbar";
import Map from "./components/map";

class App extends Component {
  state = {
    position: [37.0902, -95.7129],
    zoom: 3,
    showCountries: true,
    showUsStates: false,
    showUsCounties: false,
  };

  render() {
    return (
      <React.Fragment>
        <NavBar onToggleClicked={this.toggleLayer} />
        <Map
          position={this.state.position}
          zoom={this.state.zoom}
          show={{
            countries: this.state.showCountries,
            usStates: this.state.showUsStates,
            usCounties: this.state.showUsCounties,
          }}
        />
      </React.Fragment>
    );
  }

  toggleLayer = (property) => {
    const newState = { ...this.state };
    newState[`show${property}`] = !this.state[`show${property}`];
    this.setState(newState);
  };
}

export default App;
