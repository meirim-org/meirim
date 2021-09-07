const path = require('path');
const StaticMaps = require('staticmaps');
const Turf = require('turf');
const Log = require('../lib/log');
const Config = require('../lib/config');

const fetchStaticMap = (lat, lon) => {
	// create map with marker in center
	const map = new StaticMaps(Config.get('staticmap'));

	const marker = {
		img: path.resolve(path.join(__dirname, 'email', 'map_marker.png')),
		width: 32,
		height: 32,
		coord: [lon, lat]
	};
	map.add(marker);

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

const drawStaticMapWithPolygon = (lat, lon, geoJSON) => {
	const map = new StaticMaps({
		height:600,
		width:800
	});

	var bbox = Turf.bbox(geoJSON);

	const polygon = {
		coords: geoJSON.coordinates[0],
		color: '#8F5DE2',
		width: 6
	  };


	map.addPolygon(polygon);
	return map
		.render(bbox)
		.then(() => {
			// map.addPolygon(polygon);
			return map.image.image.toString('base64');
		})
		.catch(err => {
			// fail with no image
			Log.error('Cannot generate static map for email', err);
			return '';
		});
};

module.exports = {
	fetchStaticMap,
	drawStaticMapWithPolygon
};
