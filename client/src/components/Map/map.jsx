import React from "react"
// eslint-disable-next-line

import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

//eslint-disable-next-line
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import Mapp, {Layer, Source}  from 'react-map-gl';

mapboxgl.workerClass = MapboxWorker;



// const Mapbox = ReactMapboxGl({
//     accessToken:
//         'pk.eyJ1IjoieW9zc2ktZXluYXYiLCJhIjoiY2xjcDgwcDJpMXJldTNybXFzaXNwd2FpYSJ9.JQLLuh4VYjrxgpxWIrYsGA'
// });
const layerStyle = {
    id: 'point',
    type: 'circle',
    paint: {
        'circle-radius': 10,
        'circle-color': '#007cbf'
    }
};

export const Map = ({geojson}) => {
    return (
        <Mapp
            mapboxAccessToken="pk.eyJ1IjoieW9zc2ktZXluYXYiLCJhIjoiY2xjcDgwcDJpMXJldTNybXFzaXNwd2FpYSJ9.JQLLuh4VYjrxgpxWIrYsGA"
            initialViewState={{
                longitude:  34.82341235969558,
                latitude: 31.812881942711954,
                zoom: 7
            }}
            style={{width: "100vw", height: "100vh"}}
            mapStyle="mapbox://styles/mapbox/streets-v9"
        >
            { geojson &&  <Source id="my-data" type="geojson" data={geojson}>
                <Layer {...layerStyle} />
            </Source>}
        </Mapp>
        )

}