const moment = require('moment');
const path = require('path');
const Geocoder = require('../../service/osm_geocoder');
const NodeGeocoder = require('../../service/geocoder');
const Log = require('../log');
const aws = require('aws-sdk');
const fs = require('fs');
const { formatDate } = require('../date');
const { TREE_PERMIT_TABLE } = require('../../model/tree_permit_constants');
const {
	TEL_AVIV_OFFICAL, TEL_AVIV_FORMATS, PARDES_HANA_FORMATS, PARDES_HANA_OFFICAL,
	PLACES_WITHOUT_GEOM
} = require('./tree_crawler_consts');


const TIMEZONE_DIFF = 3;

const figureStartDate = (permit_issue_date, hour, inputFormat) => {
	const format = inputFormat || 'DD/MM/YYYY';
	const issue_date = permit_issue_date ? moment(permit_issue_date, format).add(TIMEZONE_DIFF, 'hours') : moment().format(format);
	const isoDate = issue_date.add(14, 'days').toISOString().split('T')[0]; 
	return `${isoDate}T${hour}`;
};

const calculateLastDateToObject = (start_date, hour, inputFormat) => {
	const format = inputFormat || 'DD/MM/YYYY';
	const last_date = start_date ? moment(start_date, format).subtract(1, 'days') : moment().add(12, 'days').format(format);
	const isoDate = last_date.toISOString().split('T')[0]; 
	return `${isoDate}T${hour}`;
};

const generateFilenameByTime =(url, localTreesDir) =>{
	const parsedFile = path.parse(url);
	const filenameNoDate = parsedFile.base;
	const filenameWithDate = parsedFile.name.toLowerCase() + '-' + moment().format('YYYY-MM-DD-hh-mm-ss') + parsedFile.ext.toLowerCase();
	const localFilename = path.resolve(localTreesDir, filenameNoDate);
	return { s3filename: filenameWithDate, localFilename: localFilename };
};

const isEmptyRow = (row) => {
	return (Object.values(row).filter(Boolean).length === 0);
};

const unifyPlaceFormat = (place) => {
	const formattedPlace = place.replace('-', ' ').replace(/\s+/gi, ' ').trim();
	// special cases
	if (TEL_AVIV_FORMATS.has(formattedPlace) ) {
		return TEL_AVIV_OFFICAL;
	}
	if (PARDES_HANA_FORMATS.has(formattedPlace)) {
		return PARDES_HANA_OFFICAL;
	}
	return formattedPlace;
};

async function uploadToS3(filename, bucketName, fullFileName) {
	const fileStream = fs.createReadStream(fullFileName);
	fileStream.on('error', function (err) {
		Log.error('File Error', err);
	});
	const keyName = 'regional/' + filename;
	const objectParams = { Bucket: bucketName, Key: keyName, Body: fileStream };
	const res = await new aws.S3({ apiVersion: '2006-03-01' }).putObject(objectParams).promise();
	Log.info(`Successfully Uploaded to ${bucketName}/${keyName}. Status code: ${res.$response.httpResponse.statusCode}`);
}

async function generateGeom(db, place, street, gush, helka) {
	
	let res = '';
	const address = `${place} ${street || ''}`;
	Log.debug(`address: ${address} `);

	if (!place) return;
	if (PLACES_WITHOUT_GEOM.has(place)) return;
	Log.info(`before resolution of gush helka ${gush}-${helka}. time: ${new Date().toString()}`);
	const polygon = await NodeGeocoder.gushHelkaToPolygon(gush, helka);
	Log.info(`after resolution of gush helka ${gush}-${helka}. time: ${new Date().toString()}`);
	if (!polygon) {
		if (place && street) {
			res = await Geocoder.getGeocode( place, street);
			if (!res) { // try geocode place only
				Log.debug(`Couldn't geocode address: ${address}. try to fetch place from db.`);
				res = await Geocoder.fetchOrGeocodePlace({ 'db':db, 'table':TREE_PERMIT_TABLE, 'place': place });
				if (!res ) {
					Log.debug(`Failed to geocode address: ${place}`);
					return;
				}
			}
			Log.debug(`Managed to geocode address ${address} : ${res.longitude},${res.latitude} `);

		}
		else { // only place, no street
			res = await Geocoder.fetchOrGeocodePlace({ 'db':db, 'table':TREE_PERMIT_TABLE, 'place': place });
			if (!res ) {
				Log.debug(`Failed to geocode address: ${place}`);
				return;
			}
		}
	}
	const polygonFromPoint = polygon || JSON.parse(`{ "type": "Polygon", "coordinates": [[ [ ${res.longitude}, ${res.latitude}],[ ${res.longitude}, ${res.latitude}],[ ${res.longitude}, ${res.latitude}],[ ${res.longitude}, ${res.latitude}]  ]] }`);
	return polygonFromPoint;
}

module.exports = {
	generateGeomFromAddress: generateGeom,
	uploadToS3,
	generateFilenameByTime,
	isEmptyRow,
	unifyPlaceFormat,
	formatDate,
	figureStartDate,
	calculateLastDateToObject
};