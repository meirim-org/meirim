const NodeGeocoder = require('node-geocoder');
const turf = require('turf');
const Config = require('../lib/config');
const axios = require('axios');
const Log = require('../lib/log');

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
const BAD_PARCELS = ['203000', '202011', '202000', '201000', '200000', '200001'];

const gushHelkaToPolygon = async (gush, helka) => {		
	if (!gush || !helka) {
		return;
	}
	
	if (BAD_PARCELS[gush]) {
		return;
	}


	// parse the raw string into a unique array of numbers 
	// e.g -
    //  - "123,123" => [123]
	//  - "1-2" => [1,2]
	//  - "helka 4 and 5" => [4,5]  
	const helkaArr = [...new Set(helka.match(/\d+/gi))];


	// filter the raw string into a single numeric value 
	// e.g - "194,194" => 194
	const filteredGush = (gush.match(/\d+/i) || [])[0];
	
	try {

		const features = (await Promise.all(
			helkaArr.map(async (helka) => {
				try {
					const res = await axios(
						{
							url: `https://open.govmap.gov.il/geoserver/opendata/wfs?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=opendata:PARCEL_ALL&TYPENAME=opendata:PARCEL_ALL&outputFormat=json&cql_FILTER=GUSH_NUM=${filteredGush}AND%20PARCEL=${helka}&srsName=EPSG:4326`,
							method: 'get',
							timeout: 20000,
						});
					const geoJsonRes = res.data;
					
					if (!geoJsonRes || !geoJsonRes['features']) {
						Log.error('Error in geoJson:', geoJsonRes);
						return;
					}
					
					if (geoJsonRes['features'].length === 0) {
						Log.warn('geoJsonRes feature is blank:', geoJsonRes);
						return null;
					}
	
					return geoJsonRes['features'][0];
				} catch(e) {
					return null;
				}
			})
		)).filter(Boolean);

		if (features.length === 0) {
			return null;
		}
		else if (features.length === 1) {
			return features[0];
		} else {
			const geometry = features.reduce((prev, current) => {
				if (!prev) {
					return current;
				}

				return turf.union(prev, current);
			}, null);
		
			return geometry;
		}
	}
	catch (err) {
		Log.error('could not enrich with gush helka: ',err.message);
		return;
	}
};


module.exports = {
	geocoder,
	degreeToMeter,
	gushHelkaToPolygon
};
