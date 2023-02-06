import React, {useCallback, useState} from "react"
// eslint-disable-next-line
import 'mapbox-gl/dist/mapbox-gl.css';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

//eslint-disable-next-line
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import Mapp, {Layer, Source, Popup, useMap }  from 'react-map-gl';
import Card from "@material-ui/core/Card";
import {Link} from "react-router-dom";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Mapa from "../Mapa";
import {timeToObjectionText} from "../../pages/Tree/utils";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

mapboxgl.workerClass = MapboxWorker;
const layerStyle = {
    id: 'geojson',
    type: 'fill',
    paint: {
        'fill-color': '#e56666',
        'fill-outline-color': '#000000',
        // 'line-color': '#000000',
        // 'fill-color': [
        //     'interpolate',
        //     ['linear'],
        //     ['get', 'total_trees'],
        //     10,
        //     'rgb(126,207,252)',
        //     20,
        //     'rgb(245,179,141)',
        //     50,
        //     'rgb(239,138,98)',
        //     100,
        //     'rgb(178,24,43)'
        // ],// blue color fill
        'fill-opacity': 0.5
    },
};

export const Map = ({geojson}) => {
    const [hoverInfo, setHoverInfo] = useState(null);

    const onHover = useCallback(event => {
        const county = event.features && event.features[0]
        if (!county) {return}

        setHoverInfo({
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
            properties: county && county.properties
        });
    }, []);

    const selectedCounty = (hoverInfo && hoverInfo.properties) || '';

    console.log(hoverInfo, selectedCounty)
    return (
        <Mapp
            mapboxAccessToken="pk.eyJ1IjoieW9zc2ktZXluYXYiLCJhIjoiY2xjcDgwcDJpMXJldTNybXFzaXNwd2FpYSJ9.JQLLuh4VYjrxgpxWIrYsGA"
            initialViewState={{
                longitude:  34.82341235969558,
                latitude: 31.812881942711954,
                zoom: 7
            }}
            interactive={true}
            interactiveLayerIds={["geojson", "geojson2"]}
            style={{width: "100vw", height: "100vh"}}
            onClick={onHover}
            mapStyle="mapbox://styles/mapbox/light-v11">
            <MapImage/>
            { geojson &&  <Source id="my-data" type="geojson" data={geojson}>
                <Layer {...layerStyle} />
                <Layer  id='geojson2'  type="symbol"  layout={{
                'icon-image': 'large-tree-pin',
                'icon-size': 0.2,
            }}  filter={[">", ["get", "total_trees"], 50]}/>
                <Layer   id='geojson3'  type="symbol"  layout={{
                    'icon-image': 'medium-tree-pin',
                    'icon-size': 0.2,
                }}  minzoom={12} filter={["<", ["get", "total_trees"], 10]}/>
                <Layer  id='geojson4'  type="symbol"  layout={{
                    'icon-image': 'medium-tree-pin',
                    'icon-size': 0.2,
                }}  minzoom={10} filter={["all", [">=", ["get", "total_trees"], 10], ["<=", ["get", "total_trees"], 49]]}/>
            </Source>}

            {hoverInfo && (
                <Popup longitude={hoverInfo.longitude} latitude={hoverInfo.latitude}
                       anchor="bottom"
                       closeButton={true}
                       onClose={() => setHoverInfo(false)}>
                    <Card className="card" raised={true}>
                        <Link
                            className="card-link"
                            to={`/tree/` + selectedCounty.id}
                            target={"_blank"}
                        >
                            <CardActionArea className="card-action-area">
                                <CardContent className="card-content">
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="h2"
                                        color="textPrimary"
                                    >
                                        {`מספר העצים: ${selectedCounty.total_trees}`}
                                    </Typography>
                                    <CardContentAddress tree={selectedCounty} />
                                    <CardContentField field={selectedCounty.action} fieldBold='פעולה:'/>
                                    <CardContentField field={selectedCounty.reason_short} fieldBold='סיבה:' />
                                </CardContent>
                            </CardActionArea>
                        </Link>
                    </Card>
                </Popup>)}
        </Mapp>
        )

}


function MapImage() {
    const { current: map } = useMap();
    if (!map.hasImage('large-tree-pin')) {
        map.loadImage('/images/large-tree-pin.png', (error, image) => {
            if (error) throw error;
            if (!map.hasImage('large-tree-pin')) map.addImage('large-tree-pin', image);
        });
    }

    if (!map.hasImage('small-tree-pin')) {
        map.loadImage('/images/small-tree-pin.png', (error, image) => {
            if (error) throw error;
            if (!map.hasImage('small-tree-pin')) map.addImage('small-tree-pin', image);
        });
    }

    if (!map.hasImage('medium-tree-pin')) {
        map.loadImage('/images/medium-tree-pin.png', (error, image) => {
            if (error) throw error;
            if (!map.hasImage('medium-tree-pin')) map.addImage('medium-tree-pin', image);
        });
    }

    return null;
}

function CardContentAddress(props) {
    const { street, street_number } = props.tree;
    let address = 'לא מצוין'
    if (street && street_number) {
        address = `${street} ${street_number}`;
    }
    else if (street) {
        address = `${street}`;
    }
    return (
        <Typography component="p" color="textPrimary"> <strong>כתובת: </strong>{address}</Typography>
    )
};

function CardContentField(props) {
    const {field, fieldBold} = props;
    const text = field || 'לא מצוין'
    return 	<Typography component="p" color="textPrimary"> <strong>{fieldBold} </strong>{text}</Typography>
}