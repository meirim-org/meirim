const Exception = require('../model/exception');
const NodeGeocoder = require('node-geocoder');
const Config = require('../lib/config');
const Log = require('../lib/log');

const geocoder = NodeGeocoder(Config.get('osmGeocoder'));

async function getGeocode(place, street) {
	try {
		const address = (place && street) ?
			`${place} ${street}` : `${place}`;

		const res = await geocoder.geocode(address);
		return res[0];
	}
	catch (err) {
		Log.error(err.message || err);
		return;
	}
}

async function fetchOrGeocodePlace(params) {
	//TODO in case of place, do not use node-geocoder, but query nominatim directly for geojson polygon
	const { db, geom_field='geom', place_field='place', table, place } = params;
	if (!db ) {
		throw new Exception.Error('No DB was passed to fetchOrGeocode!');
	}
	//Since nominatim is very strict reagrding its usage policy, we first check if we have place's location in our db.
	const geomFromDB = await db.select(geom_field).from(table).where({ [place_field]: place }).limit(1);
	if (geomFromDB && geomFromDB[0] && geomFromDB[0].geom &&
		geomFromDB[0].geom[0] && geomFromDB[0].geom[0][0] &&
		geomFromDB[0].geom[0][0].x && geomFromDB[0].geom[0][0].y ) {
		const res = {
			longitude: geomFromDB[0].geom[0][0].x,
			latitude: geomFromDB[0].geom[0][0].y
		};
		Log.debug(`Found place coordinates in DB: ${res.longitude},${res.latitude} `);
		return res;
	}
	else {
		const res = await getGeocode(place);
		if (!res ) {
			Log.error(`Couldn't geocode address: ${place}.`);
			return;
		}
		Log.debug(`Managed to geocode place ${place} : ${res.longitude},${res.latitude} `);
		return res;
	}
}


module.exports = {
	geocoder,
	fetchOrGeocodePlace,
	getGeocode
};
