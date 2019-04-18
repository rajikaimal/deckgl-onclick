import React from "react";
import { render } from "react-dom";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer, LineLayer } from "@deck.gl/layers";
import { StaticMap } from "react-map-gl";
import { polygon } from "@turf/helpers";
// @turf/intersect doesn't work for all cases, @turf/turf intersect uses a different algorithm
import { intersect as turfIntersect } from "@turf/turf";
import turfUnion from "@turf/union";
import ControlPanel from "./control-panel";

import data from "./geodata.json";

// Set your mapbox access token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken;

// Initial viewport settings
const initialViewState = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 2,
  pitch: 0,
  bearing: 0
};

// Data to be used by the LineLayer
//const data = [{sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}];

const lineData = [
  {
    sourcePosition: [-122.41669, 37.7853],
    targetPosition: [-122.41669, 37.781]
  }
];

class App extends React.Component {
  state = {
    polygon1: null,
    polygon2: null,
    geoData: geoJsonData
  };

  constructor(props) {
    super(props);

    this._calcIntersect = this._calcIntersect.bind(this);
    this._calcUnion = this._calcUnion.bind(this);
  }

  _calcIntersect() {
    console.log(this.state.polygon1);
    console.log(this.state.polygon2);
    const intersect = turfIntersect(this.state.polygon1, this.state.polygon2);

    let arr =
      this.state.geoData.features != undefined
        ? this.state.geoData.features
        : this.state.geoData;

    var filtered = arr.filter(value => {
      return (
        value.properties.name != this.state.polygon1.properties.name &&
        value.properties.name != this.state.polygon2.properties.name
      );
    });

    if (intersect !== null) {
      filtered.push(intersect);

      this.setState({
        polygon1: null,
        polygon2: null,
        geoData: filtered
      });
    } else {
      this.setState({
        polygon1: null,
        polygon2: null
      });
    }
  }

  _calcUnion() {
    const union = turfUnion(this.state.polygon1, this.state.polygon2);

    let arr =
      this.state.geoData.features != undefined
        ? this.state.geoData.features
        : this.state.geoData;

    var filtered = arr.filter(value => {
      return (
        value.properties.name != this.state.polygon1.properties.name &&
        value.properties.name != this.state.polygon2.properties.name
      );
    });

    console.log("Union", union);

    if (union !== null) {
      filtered.push(union);
      
      this.setState({
        polygon1: null,
        polygon2: null,
        geoData: filtered
      });
    } else {
      this.setState({
        polygon1: null,
        polygon2: null
      });
    }
  }

  render() {
    const layers = [
      new GeoJsonLayer({
        id: "geojson-layer",
        data: this.state.geoData,
        pickable: true,
        stroked: true,
        filled: true,
        extruded: false,
        lineWidthScale: 40,
        lineWidthMinPixels: 2,
        getFillColor: [160, 160, 180, 200],
        getLineColor: [0, 0, 0, 255],
        highlightColor: [127, 191, 63, 0],
        autoHighlight: true,
        wireframe: false,
        getRadius: 100,
        getLineWidth: 1,
        getElevation: 30,
        onClick: info => {
          console.log(info);
          if (this.state.polygon1 == null) {
            this.setState({
              polygon1: info.object
            });

            console.log("polygon 1 set");
          } else {
            this.setState({
              polygon2: info.object
            });

            console.log("polygon 2 set");
          }

          return true;
        }
      })
    ];

    return (
      <div>
        <div style={{ width: "50%" }}>
          <DeckGL
            layers={layers}
            initialViewState={initialViewState}
            controller={true}
            onClick={() => {
              console.log("DeckGL");
            }}
          >
            <StaticMap mapboxApiAccessToken={MAPBOX_TOKEN} />
          </DeckGL>
        </div>

        <ControlPanel
          containerComponent={this.props.containerComponent}
          settings={this.state}
          onChange={this._updateSettings}
          onIntersect={() => {
            this._calcIntersect();
          }}
          onUnion={() => {
            this._calcUnion();
          }}
        />
      </div>
    );
  }
}

export function renderToDom(container) {
  render(<App />, container);
}

let geoJsonData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "40"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [[-109, 50], [-102, 50], [-102, 37], [-109, 37], [-109, 50]]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "50"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [[-130, 41], [-102, 41], [-102, 37], [-130, 37], [-130, 41]]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "100"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [[-120, 60], [-102, 60], [-102, 65], [-120, 65], [-120, 60]]
        ]
      }
    }
  ]
};
