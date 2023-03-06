import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Map } from '../../components/Map/map';
import {Layer, Popup, Source, useMap} from 'react-map-gl';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { Button } from '../../shared';
import {timeToObjectionText} from "../Tree/utils";

const polygonStyle = {
	id: 'geojson',
	type: 'fill',
	paint: {
		'fill-color': '#e56666',
		'fill-outline-color': '#000000',
		'fill-opacity': 0.5
	},
};



const symbolStyle = ({ image, size }) => ({
	type:'symbol',
	sourceIde: 'geojson',
	layout:{
		'icon-image': ['case',
		['==', ['get', 'is_active'], true],
		`${image}-active`,
		`${image}-disable`,
		],
		'icon-size': size,
		'icon-ignore-placement': true,
		'text-field': '{total_trees} עצים',
		'text-size': 14,
		'icon-anchor': 'bottom',
		'text-anchor': 'top'
	},
});

const TreeMap = ({ geojson }) => {
	const [locationInfo, setLocationInfo] = useState(null);

	const onClick = useCallback(event => {
		const location = event.features && event.features[0];
		if (!location) {return;}

		setLocationInfo({
			longitude: event.lngLat.lng,
			latitude: event.lngLat.lat,
			properties: location && location.properties
		});
	}, []);

	const selectedLocationProps = (locationInfo && locationInfo.properties) || '';

	const timeToObjection = selectedLocationProps ? timeToObjectionText(selectedLocationProps.last_date_to_objection): null;
	const place = selectedLocationProps.place;


	return (
		<>
			<Map interactiveLayerIds={['high-tree', 'low-tree', 'mid-tree']}
				onClick={onClick}
				mapStyle="mapbox://styles/meirim/cle36p24n003a01mtwtj1czve"
				style={{ width: '100vw', height: '100vh' }}
				initialViewState={{
					longitude:  34.82341235969558,
					latitude: 31.812881942711954,
					zoom: 7
				}}>
				<MapImage/>
				{ geojson &&  <Source id="trees-data" type="geojson" data={geojson}>
					<Layer {...polygonStyle} />
					<Layer  id='high-tree' {...symbolStyle({ image: 'trees-large-pin', size: 0.7 })}  filter={['>', ['get', 'total_trees'], 50]}/>
					<Layer  id='low-tree' {...symbolStyle({ image: 'trees-medium-pin', size: 0.8 })}  minzoom={12} filter={['<', ['get', 'total_trees'], 10]}/>
					<Layer  id='mid-tree' {...symbolStyle({ image: 'trees-medium-pin', size: 0.8 })}  minzoom={10} filter={['all', ['>=', ['get', 'total_trees'], 10], ['<=', ['get', 'total_trees'], 49]]}/>
				</Source>}

				{locationInfo && (
					<Popup longitude={locationInfo.longitude} latitude={locationInfo.latitude} style={{ minWidth: 250 }}
						anchor="bottom"
						closeButton={false}
						onClose={() => setLocationInfo(false)}>
						<Card>
							<CardContent className="card-content">
								<div className="map-title">
									{place && <span className="btn btn-light disabled">{place}</span>}
									{timeToObjection && <span className="btn btn-light map-title-left">{timeToObjection}</span>}
								</div>
								<Typography
									gutterBottom
									variant="h5"
									component="h2"
									color="textPrimary"
								>
									{`מספר העצים: ${selectedLocationProps.total_trees}`}
								</Typography>
								<Address tree={selectedLocationProps} />
								<ContentField field={selectedLocationProps.action} fieldBold='פעולה:'/>
								<ContentField field={selectedLocationProps.reason_short} fieldBold='סיבה:' />

								<Link
									className="card-link"
									to={'/tree/' + selectedLocationProps.id}
									target={'_blank'}
								>
									<Button text=" צפה בפרטים"  type={'primary'} small/>
								</Link>
							</CardContent>
						</Card>
					</Popup>)}
			</Map>
		</>
	);
};


function MapImage() {
	const { current: map } = useMap();
	if (!map.hasImage('trees-large-pin-disable')) {
		map.loadImage('/images/trees-large-pin-disable.png', (error, image) => {
			if (error) throw error;
			if (!map.hasImage('trees-large-pin-disable')) map.addImage('trees-large-pin-disable', image);
		});
	}

	if (!map.hasImage('trees-large-pin-active')) {
		map.loadImage('/images/trees-large-pin-active.png', (error, image) => {
			if (error) throw error;
			if (!map.hasImage('trees-large-pin-active')) map.addImage('trees-large-pin-active', image);
		});
	}

	if (!map.hasImage('trees-medium-pin-active')) {
		map.loadImage('/images/trees-medium-pin-active.png', (error, image) => {
			if (error) throw error;
			if (!map.hasImage('trees-medium-pin-active')) map.addImage('trees-medium-pin-active', image);
		});
	}

	if (!map.hasImage('trees-medium-pin-disable')) {
		map.loadImage('/images/trees-medium-pin-disable.png', (error, image) => {
			if (error) throw error;
			if (!map.hasImage('trees-medium-pin-disable')) map.addImage('trees-medium-pin-disable', image);
		});
	}

	return null;
}

function Address(props) {
	// eslint-disable-next-line react/prop-types
	const { street, street_number } = props.tree;
	let address = 'לא מצוין';
	if (street !== 'null' && street_number !== 'null') {
		address = `${street} ${street_number}`;
	}
	else if (street !== 'null') {
		address = `${street}`;
	}

	return (
		<Typography component="p" color="textPrimary"> <strong>כתובת: </strong>{address}</Typography>
	);
};

function ContentField(props) {
	// eslint-disable-next-line react/prop-types
	const { field, fieldBold } = props;
	const text = field || 'לא מצוין';

	return 	<Typography component="p" color="textPrimary"> <strong>{fieldBold} </strong>{text}</Typography>;
}

TreeMap.propTypes = {
	geojson: PropTypes.object.isRequired,
};

export default TreeMap;