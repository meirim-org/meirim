import React, { Component } from 'react';

import leaflet from 'leaflet';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';

import t from '../locale/he_IL';

class Mapa extends Component {
  render() {
    const { geom, hideZoom } = this.props;
    const bounds = leaflet.geoJSON(geom).getBounds();

    return <Map
      center={bounds.getCenter() }
      bounds={bounds}
      zoomControl={!hideZoom}
      style={{
        height: "100%",
        width: "100%"
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"/>
      <GeoJSON data={geom}/>
    </Map>;
  }
}

export default Mapa;
