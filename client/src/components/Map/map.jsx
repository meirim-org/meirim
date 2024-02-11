import React from 'react';
// eslint-disable-next-line
import 'mapbox-gl/dist/mapbox-gl.css';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

//eslint-disable-next-line
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import Mapbox from 'react-map-gl';
import PropTypes from 'prop-types';

mapboxgl.workerClass = MapboxWorker;
const apiKey = process.env.REACT_APP_MAPBOX_KEY;


export const Map = ({ onMouseMove, id, children, onClick, initialViewState, interactiveLayerIds, style, mapStyle = 'mapbox://styles/mapbox/light-v11' }) => {
	return (
		<Mapbox
			mapboxAccessToken={apiKey}
			initialViewState={initialViewState}
			interactive={true}
			id={id}
			onMouseMove={onMouseMove}
			interactiveLayerIds={interactiveLayerIds}
			style={style}
			onClick={onClick}
			mapStyle={mapStyle}>
			{children}
		</Mapbox>
	);
};

Map.propTypes = {
	onClick: PropTypes.func,
	onMouseMove: PropTypes.func,
	mapStyle: PropTypes.string,
	id: PropTypes.string,
	children: PropTypes.array,
	initialViewState: PropTypes.object,
	interactiveLayerIds: PropTypes.arrayOf(PropTypes.string),
	style: PropTypes.object,
};