import React from 'react';
// eslint-disable-next-line
import 'mapbox-gl/dist/mapbox-gl.css';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

//eslint-disable-next-line
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import Mapbox from 'react-map-gl';
import PropTypes from 'prop-types';

mapboxgl.workerClass = MapboxWorker;


export const Map = ({ children, onClick, initialViewState, interactiveLayerIds, style }) => {
	return (
		<Mapbox
			mapboxAccessToken="pk.eyJ1IjoieW9zc2ktZXluYXYiLCJhIjoiY2xjcDgwcDJpMXJldTNybXFzaXNwd2FpYSJ9.JQLLuh4VYjrxgpxWIrYsGA"
			initialViewState={initialViewState}
			interactive={true}
			interactiveLayerIds={interactiveLayerIds}
			style={style}
			onClick={onClick}
			mapStyle="mapbox://styles/mapbox/light-v11">
			{children}
		</Mapbox>
	);
};

Map.propTypes = {
	onClick: PropTypes.func,
	children: PropTypes.object,
	initialViewState: PropTypes.object,
	interactiveLayerIds: PropTypes.arrayOf(PropTypes.string),
	style: PropTypes.object,
};