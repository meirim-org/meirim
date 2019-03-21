import React, { Component } from 'react';

import leaflet from 'leaflet';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';

import './Mapa.css';
import t from '../locale/he_IL';

class Mapa extends Component {
  render() {
    const { geom, hideZoom, disableInteractions, title } = this.props;
    const bounds = leaflet.geoJSON(geom).getBounds();

    return <Map
      center={bounds.getCenter() }
      bounds={bounds}
      zoomControl={!hideZoom}
      boxZoom={!disableInteractions}
      doubleClickZoom={!disableInteractions}
      dragging={!disableInteractions}
      keyboard={!disableInteractions}
      scrollWheelZoom={!disableInteractions}
      tap={!disableInteractions}
      touchZoom={!disableInteractions}
      style={{
        height: "100%",
        width: "100%"
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"/>
      <GeoJSON data={geom}/>
      <div className="map-title">
           { title &&
            <button className="btn btn-light disabled">{title}</button>
           }
         </div> 
    </Map>;
  }
}

export default Mapa;
