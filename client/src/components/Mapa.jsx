import React from 'react';
import leaflet from 'leaflet';
import { Map, TileLayer, GeoJSON, ZoomControl } from 'react-leaflet';
import './Mapa.css';

const Mapa = (props) => {
    const {
        hideZoom,
        disableInteractions,
        title2,
        geom,
        countyName,
        maxZoom = 17,
        showPlaceholder = false,
    } = props;

    if (!geom || geom.length === 0) {
        if (showPlaceholder) {
            return (
                <div
                    className="map-title-placeholder"
                    style={{ height: '100%', width: '100%' }}
                >
                    {countyName && (
                        <span className="btn btn-light disabled">
                            {countyName}
                        </span>
                    )}
                    {title2 && (
                        <span className="btn btn-light map-title-left">
                            {title2}
                        </span>
                    )}
                </div>
            );
        } else {
            return null;
        }
    }

    const bounds = leaflet.geoJSON(geom).getBounds();

    // hash the geom to create a key for the layer so react replaces the component properly
    // since updated GeoJson layers are not updated after mount according to docs
    const geomHash = JSON.stringify(geom)
        .split('')
        .reduce(function (a, b) {
            a = (a << 5) - a + b.charCodeAt(0);
            return a & a;
        }, 0);

    return (
        <Map
            center={bounds.getCenter()}
            bounds={bounds}
            zoomControl={false}
            boxZoom={!disableInteractions}
            maxZoom={maxZoom}
            doubleClickZoom={!disableInteractions}
            dragging={!disableInteractions}
            keyboard={!disableInteractions}
            scrollWheelZoom={!disableInteractions}
            tap={!disableInteractions}
            touchZoom={!disableInteractions}
            style={{
                height: '100%',
                width: '100%',
            }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {!hideZoom && <ZoomControl position="bottomleft" />}
            {geom && <GeoJSON key={geomHash} data={geom} />}
            <div className="map-title">
                {countyName && (
                    <span className="btn btn-light disabled">{countyName}</span>
                )}
                {title2 && (
                    <span className="btn btn-light map-title-left">
                        {title2}
                    </span>
                )}
            </div>
        </Map>
    );
};

export default Mapa;
