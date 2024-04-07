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
const { cache } = require('sharp');

const TIMEZONE_DIFF = 3;

const figureLastObjectionDate = (startDay, hour, inputFormat) => {
	let last_day_to_objection;
	const format = inputFormat || 'DD/MM/YYYY';
	last_day_to_objection  = moment.utc(startDay, format).subtract(1, 'days');
	const isoDate = last_day_to_objection.toISOString().split('T')[0];
	return `${isoDate}T${hour}`;
};

const figureStartDate = (permit_issue_date, last_day_to_objection, hour, inputFormat, useLastDay) => {
	let start_day;
	const format = inputFormat || 'DD/MM/YYYY';
	if (useLastDay) {
		// in some cities, start date is absent, so we simply take one day after last day to objection
		start_day = moment.utc(last_day_to_objection, format).add(1, 'days');
	} else {
		const issue_date = permit_issue_date ? moment(permit_issue_date, format).add(TIMEZONE_DIFF, 'hours') : moment().format(format);
		start_day = issue_date.add(14, 'days');
	}
	const isoDate = start_day.toISOString().split('T')[0];
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
	try {
		const fileStream = fs.createReadStream(fullFileName);
		fileStream.on('error', function (err) {
			Log.error('File Error', err);
		});
		const keyName = 'regional/' + filename;
		const objectParams = { Bucket: bucketName, Key: keyName, Body: fileStream };
		const res = await new aws.S3({ apiVersion: '2006-03-01' }).putObject(objectParams).promise();
		Log.info(`Successfully Uploaded to ${bucketName}/${keyName}. Status code: ${res.$response.httpResponse.statusCode}`);
	} catch (e) {
		Log.error({message: "failed to upload to s3", error: e, filename, bucketName, fullFileName})
		throw e
	}
}

async function generateGeom(db, place, street, home_number, gush, helka) {

	let res = '';
	const address = street ? `${place} ${street} ${home_number || ''}` : place;
	Log.debug(`address: ${address} `);

	if (!place) return;
	if (PLACES_WITHOUT_GEOM.has(place)) return;
	Log.debug(`before resolution of gush helka ${gush}-${helka}. time: ${new Date().toString()}`);
	const polygon = (gush && helka) ? await NodeGeocoder.gushHelkaToPolygon(gush, helka) : undefined;
	Log.debug(`after resolution of gush helka ${gush}-${helka}. time: ${new Date().toString()}`);
	if (!polygon) {
		if (place && street) {
			res = await Geocoder.getGeocode( place, address);
			if (!res) { // try geocode place only
				Log.debug(`Couldn't geocode address: ${address}. try to fetch place from db.`);
				res = await Geocoder.fetchOrGeocodePlace({ 'db':db, 'table':TREE_PERMIT_TABLE, 'place': place });
				if (!res ) {
					Log.error(`Failed to geocode address: ${place}`);
					return;
				}
			}
			Log.info(`Managed to geocode address ${address} : ${res.longitude},${res.latitude} `);

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
	calculateLastDateToObject,
	figureLastObjectionDate
};