import React, { Component } from "react";

import leaflet from "leaflet";
import { Map, TileLayer, GeoJSON, LayersControl } from "react-leaflet";

import "./Mapa.css";

const Mapa = function({ geom, hideZoom, disableInteractions, title }) {
    const bounds = leaflet.geoJSON(geom).getBounds();
    const { BaseLayer, Overlay } = LayersControl;
    return (
        <Map
            center={bounds.getCenter()}
            bounds={bounds}
            zoomControl={!hideZoom}
            boxZoom={!disableInteractions}
            maxZoom={17}
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
            <LayersControl position="topright">
                <BaseLayer checked name="מפת רחובות">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                </BaseLayer>
                <BaseLayer name="צילום אויר">
                    <TileLayer
                        url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='&copy; <a href="http://www.esri.com/">Esri</a> i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                        maxZoom={18}
                    />
                </BaseLayer>
            </LayersControl>

            <GeoJSON data={geom} />
            <div className="map-title">
                {title && (
                    <button className="btn btn-light disabled">{title}</button>
                )}
            </div>
        </Map>
    );
};

export default Mapa;
