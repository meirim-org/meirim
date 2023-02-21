import React from 'react';
// eslint-disable-next-line
import 'mapbox-gl/dist/mapbox-gl.css';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

//eslint-disable-next-line
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import Mapbox from 'react-map-gl';
import PropTypes from 'prop-types';

mapboxgl.workerClass = MapboxWorker;


export const Map = ({ onMouseMove, id, children, onClick, initialViewState, interactiveLayerIds, style, mapStyle = 'mapbox://styles/mapbox/light-v11'}) => {
	return (
		<Mapbox
			mapboxAccessToken="pk.eyJ1IjoibWVpcmltIiwiYSI6ImNrbWNjYmlwYjJhYzYycW42NTYzcmdpYWcifQ.lCBjl1gWMI6UxySOCCBUHg"
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
    ref: PropTypes.object,
    mapStyle: PropTypes.string,
    id: PropTypes.string,
	children: PropTypes.object,
	initialViewState: PropTypes.object,
	interactiveLayerIds: PropTypes.arrayOf(PropTypes.string),
	style: PropTypes.object,
};