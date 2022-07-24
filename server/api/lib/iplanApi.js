const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

const GeoJSON = require('esri-to-geojson');
const Bluebird = require('bluebird');
const _ = require('lodash');
const { map, chunk, reduce, extend, get } = require('lodash');
// const proj4 = require('proj4');
const reproject = require('reproject');
const Config = require('../lib/config');
const Log = require('../lib/log');

const BASE_AGS_URL =
    'https://ags.iplan.gov.il/arcgisiplan/rest/services/PlanningPublic/Xplan/MapServer';
// "https://ags.iplan.gov.il/arcgis/rest/services/" +
// "PlanningPublic/Xplan_2039/MapServer";

const MAVAT_SERVICE_ID = 0;

const options = {
	rejectUnauthorized: false,
	headers: {
		'User-Agent': Config.get('general.userAgent')
	},
	json: true
};

const fields = [
	'OBJECTID',
	'Shape',
	'PLAN_AREA_CODE',
	'JURSTICTION_CODE',
	'PLAN_COUNTY_NAME',
	'PLAN_COUNTY_CODE',
	'ENTITY_SUBTYPE_DESC',
	'PL_NUMBER',
	'PL_NAME',
	'PL_AREA_DUNAM',
	'DEPOSITING_DATE',
	// 'DATE_SAF',
	// 'PL_LAST_DEPOSIT_DATE',
	// 'PL_REJECTION_DATE',
	// 'PLAN_CHARACTOR_NAME',
	// 'מטרות',
	// 'PQ_AUTHORISED_QUANTITY_110',
	// 'PQ_AUTHORISED_QUANTITY_120',
	'PL_DATE_8',
	'PL_LANDUSE_STRING',
	'STATION',
	'STATION_DESC',
	'PL_BY_AUTH_OF',
	'PL_URL',
	'Shape_Area',
	'QUANTITY_DELTA_120',
	'QUANTITY_DELTA_125',
	'LAST_UPDATE',
	'PL_ORDER_PRINT_VERSION',
	'PL_TASRIT_PRN_VERSION'
];

// const EPSG2039 = proj4.Proj(
// 	'+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-48,55,52,0,0,0,0 +units=m +no_defs'
// );

const EPSG3857 =
	'+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs';

// retain a concept of session with cookies. Otherwise Mavat fails on us.
const client = wrapper(axios.create({ jar: new CookieJar() }));

// TODO: save the links of the new website and the old website
const buildMavatURL = (serviceId, fieldsToFill, whereClause, return_geom) => {
	return `${BASE_AGS_URL}/${serviceId}/query?f=json&outFields=${fieldsToFill.join(
		','
	)}&returnGeometry=${return_geom}&where=${whereClause}&orderByFields=LAST_UPDATE DESC&outSR=3857`;
};

// const getAgamIdReuqestForBatch = async (planIds = []) => {
// 	const whereClause = planIds.length > 0 ? `PL_NUMBER IN (${planIds.join(',')})` : '';
// 	const getAgamIDURL = buildMavatURL(MAVAT_SERVICE_ID_WITH_AGAM, ['MP_ID', 'PL_NUMBER'], whereClause, 'false');

// 	try {
// 		return client.get(getAgamIDURL).then((response) => {
// 			const planDataWithAgamId = response.data.features;
// 			const map = {};
// 			planDataWithAgamId.forEach((plan) => {
// 				map[plan.attributes.PL_NUMBER] = plan.attributes.MP_ID;
// 			});
// 			return map;
// 		});
// 	}
// 	catch (err) {
// 		Log.error('Error getting agam ids for batch', err);
// 		return {};
// 	}
// };

// const getPlansAgamIds = async (planIds = []) => {
// 	const chunkSize = 50;
// 	const res = await Bluebird.all( map(chunk(planIds, chunkSize), (chunk) => getAgamIdReuqestForBatch(chunk)));
// 	const unifiedIds = reduce(res, extend);
// 	Log.debug('Got', Object.keys(unifiedIds).length, 'entries in request for agam ids on plans');
// 	return unifiedIds;
// };

const getPlanMPID = (planUrl) => {
	var regex = 'https://mavat.iplan.gov.il/SV4/1/(.+)/310';
	const res = new RegExp(regex).exec(planUrl);
	return res[1];

};

const getBlueLines = async () => {
	// we need MP_ID field to know the id in the new mavat website.
	// xplan doesn't have MP_ID in the polygons API (service id of 0)
	// so we query the centroid API (service id of 1) as well in order to get MP_ID.
	const urlWithPolygons = buildMavatURL(MAVAT_SERVICE_ID, fields, 'OBJECTID > 0', 'true');

	try {
		const responseWithPolygons = await client.get(urlWithPolygons, options);
		const geojson = GeoJSON.fromEsri(responseWithPolygons.data, {});
		Log.debug('Got', geojson.features.length, 'plans');

		// Need to populate all plans with their MP_ID
		// TODO- export to a mapping function
		for (const datum of geojson.features) {
			const agamId = getPlanMPID(datum.properties.PL_URL);
			if (agamId) {
				datum.properties.MP_ID = agamId;
				datum.properties.plan_new_mavat_url = `https://mavat.iplan.gov.il/SV4/1/${agamId}/310`;
			}
		}
		return Bluebird.map(
			geojson.features,
			(datum) => Object.assign({}, datum, {
				geometry: reproject.toWgs84(datum.geometry, EPSG3857) })
		);

	} catch (error) {
		Log.error('Failed getting blue lines plans with Agam ID', error);
		// TODO: need to return something
	}

};

const getPlanningCouncils = () => {
	const url = `${BASE_AGS_URL}/2/query?f=json&outFields=CodeMT,MT_Heb&returnGeometry=false&where=OBJECTID%3E0`;
	Log.debug('Fetch', url);
	const requestOptions = _.clone(options);
	requestOptions.uri = url;
	return Request(requestOptions);
};

module.exports = {
	getBlueLines,
	getPlanningCouncils
};
