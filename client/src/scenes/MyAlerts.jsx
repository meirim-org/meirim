import '../../node_modules/leaflet/dist/leaflet.css';
import 'rc-slider/assets/index.css';
import React from 'react';
import PropTypes from 'prop-types'
import { Map, TileLayer, Circle } from 'react-leaflet';
import _ from 'lodash';
import leaflet from 'leaflet';
import AlertTable from '../components/AlertTable';
import { CheckIfUserCanAccessPage } from 'hooks';
import api from 'services/api';

const MyAlerts = () => {

	CheckIfUserCanAccessPage();
	const [state, setState] = React.useState({ 
		error: false, loading: false, alerts: [], added: false,
		deleted: false, form: { radius: 5, address: '' }, 		
	})

	React.useEffect(() => {
		getAlerts();
	});

	const handleDelete = (alertId) => {
		api.delete('/alert/' + alertId).then(() => {
			getAlerts()
			setState(pv =>({ ...pv, deleted: true }))
		});
	}

	const getAlerts = () => {
		return api
			.get('/alert')
			.then(result => {
				let transparentLayer = leaflet.geoJSON();
				if (result.data.length > 0) {
					result.data.map(alert =>
						leaflet.geoJSON(alert.geom).addTo(transparentLayer)
					);
					const layerBounds = transparentLayer.getBounds();
					setState(pv => ({ ...pv,
						bounds: [
							layerBounds._southWest,
							layerBounds._northEast
						],
						alerts: result.data
					}));
				}
			})
			.catch(error => setState(pv => ({ ...pv, error })));
	}

	const { alerts, bounds } = state;

	return (
		<div className="rectangle">
			<h5 className="container-title">ההתראות שלי</h5>
			<div className="row">
				<div className="col col-sm-6">
					<AlertTable
						alerts={alerts}
						onDelete={handleDelete}
					/>
				</div>
				<div className="col col-sm-6">
					{alerts.length > 0 && (
						<Mapa alerts={alerts} bounds={bounds} />
					)}
				</div>
			</div>
		</div>
	)
}

function Mapa(props) {
	return (
		<Map
			bounds={props.bounds}
			style={{
				height: '300px',
				width: '100%'
			}}
		>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			/>
			{props.alerts.map((alert, idx) => {
				let center = leaflet
					.geoJSON(alert.geom)
					.getBounds()
					.getCenter();
				
				return (
					<Circle
						radius={alert.radius * 1000}
						center={center}
						key={idx}
					/>
				);
			})}
		</Map>
	);
}

Mapa.propTypes = {
	alerts: PropTypes.array,
	bounds: PropTypes.array
}

export default MyAlerts;