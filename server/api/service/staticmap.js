const path = require('path');
const StaticMaps = require('staticmaps');
const Log = require('../lib/log');
const Config = require('../lib/config');
const turf = require('turf');

const fetchStaticMap = (lat, lon) => {
	// create map with marker in center
	const map = new StaticMaps(Config.get('staticmap'));

	const marker = {
		img: path.resolve(path.join(__dirname, 'email', 'map_marker.png')),
		width: 32,
		height: 32,
		coord: [lon, lat]
	};
	map.addMarker(marker);

	// resolve with base64 string so we don't pass buffers around
	return map
		.render()
		.then(() => map.image.image.toString('base64'))
		.catch(err => {
			// fail with no image
			Log.error('Cannot generate static map for email', err);
			return '';
		});
};

const drawStaticMapWithPolygon = async (geoJSON) => {
	const map = new StaticMaps(Config.get('staticmap'));
	var bbox = turf.bbox(geoJSON);
	const polygon = {
		coords: geoJSON.coordinates[0],
		color: '#8F5DE2',
		width: 6
	};
	map.addPolygon(polygon);
	return map
		.render(bbox)
		.then(() => map.image.image.toString('base64'))
		.catch(err => {
			// fail with no image
			Log.error('Cannot generate static map for email', err);
			return;
		});
};

module.exports = {
	fetchStaticMap,
	drawStaticMapWithPolygon
};
