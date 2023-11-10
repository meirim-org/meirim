import React, { useState } from 'react';
import leaflet from 'leaflet';
import { Circle, Map, TileLayer } from 'react-leaflet';
import PropTypes from 'prop-types';
import AlertsMapaTumbler from '../AlertsMapaTumbler';

const AlertsMapa = ({ alerts, bounds }) => {
	const [tumbler, setTumbler] = useState({
		plans: true,
		trees: true,
	});

	const tumblerHandler = (e) => {
		setTumbler((prevTumbler) => ({
			...prevTumbler,
			[e.target.id]: e.target.checked,
		}));
	};

	let filteredAlerts;

	if (tumbler.plans && tumbler.trees) {
		filteredAlerts = [...alerts];
	} else if (tumbler.plans) {
		filteredAlerts = alerts.filter((alert) => alert.type === 'plan');
	} else if (tumbler.trees) {
		filteredAlerts = alerts.filter((alert) => alert.type === 'tree');
	} else {
		filteredAlerts = [];
	}

	return (
		<Map
			bounds={bounds}
			style={{
				height: '100%',
				width: '100%',
			}}
		>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			/>

			{filteredAlerts.map((alert, idx) => {
				if (alert.geom) {
					let center = leaflet
						.geoJSON(alert.geom)
						.getBounds()
						.getCenter();

					const radius = alert.radius ? alert.radius * 1000 : 1000;

					return (
						<Circle
							radius={radius}
							center={center}
							key={idx}
							color={
								alert.type === 'plan'
									? '#1976D2'
									: alert.type === 'tree'
									? '#006141'
									: '#000000'
							}
						/>
					);
				} else {
					return null;
				}
			})}

			<AlertsMapaTumbler
				tumbler={tumbler}
				tumblerHandler={tumblerHandler}
			/>
		</Map>
	);
};

AlertsMapa.propTypes = {
	alerts: PropTypes.array,
	bounds: PropTypes.array,
};

export default AlertsMapa;
