import React from 'react';
import leaflet from 'leaflet';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import './Mapa.css';

const Mapa = (props) =>  {
	const { hideZoom, disableInteractions, title2, geom, countyName } = props;
	
	if (!geom) return null;
	const bounds = leaflet.geoJSON(geom).getBounds();
	
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
				height: '100%',
				width: '100%',
			}}
		>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			/>
			{ 
				geom && <GeoJSON data={geom} />
			}
			<div className="map-title">
				{countyName && <button className="btn btn-light disabled">{countyName}</button>}
				{title2 && <button variant="info" className="btn btn-light map-title-left">{title2}</button>}
			</div>
		</Map>
	);
};

export default Mapa;
