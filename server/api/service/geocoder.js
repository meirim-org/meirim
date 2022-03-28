const NodeGeocoder = require('node-geocoder');
const Config = require('../lib/config');
const axios = require('axios');

const geocoder = NodeGeocoder(Config.get('geocoder'));

const degreeToMeter = (lon, lat, dn, de) => {
	// Earth’s radius, sphere
	const R = 6378137;
	const radian = 180;

	// Coordinate offsets in radians
	const dLat = dn / R;
	const dLon = de / (R * Math.cos((Math.PI * lat) / radian));
	// OffsetPosition, decimal degrees
	const latO = lat + (dLat * radian) / Math.PI;
	const lonO = lon + (dLon * radian) / Math.PI;
	return [lonO, latO];
};


// Some parcels (Gushim) are malformed (usually in the Golan Heights) and should be ignored.
const BAD_PARCELS = ['203000','202011','202000', '201000', '200000', '200001'];

const gushHelkaToPolygon = async (gush, helka) => {
	if (!gush || ! helka){
		return;
	}
	if (BAD_PARCELS[gush]) {
		return;
	}
	const res = await axios(
		{ 
			url :`https://open.govmap.gov.il/geoserver/opendata/wfs?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=opendata:PARCEL_ALL&TYPENAME=opendata:PARCEL_ALL&outputFormat=json&cql_FILTER=GUSH_NUM=${gush}AND%20PARCEL=${helka}&srsName=EPSG:4326`,
			method: 'get',
			timeout: 20000,
		});
	const geoJsonRes = res.data;

	if (!geoJsonRes || !geoJsonRes['features'] || !geoJsonRes['features'][0] || !geoJsonRes['features'][0]['geometry']) {
		console.log('Error in geoJson:', geoJsonRes);
		return;
	}
	console.log('Gush Helka polygon is:',JSON.stringify( geoJsonRes['features'][0]['geometry'] ));
	const geometryRes = geoJsonRes['features'][0]['geometry'];
	if (geometryRes['type'] == 'Polygon') {
		return geometryRes;
	}
	else if (geometryRes['type'] == 'MultiPolygon'){
		return { type: 'polygon', coordinates: geometryRes.coordinates[0] };
	}
	else return geometryRes;
};


module.exports = {
	geocoder,
	degreeToMeter,
	gushHelkaToPolygon
};
