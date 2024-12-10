const axios = require('axios');
const GeoJSON = require('esri-to-geojson');
const Bluebird = require('bluebird');
const _ = require('lodash');
// const proj4 = require('proj4');
const reproject = require('reproject');
const Config = require('../lib/config');
const Log = require('../lib/log');

const BASE_AGS_URL =
    'https://ags.iplan.gov.il/arcgisiplan/rest/services/PlanningPublic/Xplan/MapServer';
// "https://ags.iplan.gov.il/arcgis/rest/services/" +
// "PlanningPublic/Xplan_2039/MapServer";

//const MAVAT_SERVICE_ID = 1;

const options = {
	rejectUnauthorized: false,
	headers: {
		'User-Agent': Config.get('general.userAgent')
	},
	json: true
};

// const fields = [
// 	'objectid',
// 	'shape',
// 	//	'plan_area_code',
// 	//	'jurstiction_code',
// 	'plan_county_name',
// 	//	'plan_county_code',
// 	'entity_subtype_desc',
// 	'pl_number',
// 	'pl_name',
// 	'pl_area_dunam',
// 	'depositing_date',
// 	'mp_id',
// 	// 'DATE_SAF',
// 	// 'PL_LAST_DEPOSIT_DATE',
// 	// 'PL_REJECTION_DATE',
// 	// 'PLAN_CHARACTOR_NAME',
// 	// 'מטרות',
// 	// 'PQ_AUTHORISED_QUANTITY_110',
// 	// 'PQ_AUTHORISED_QUANTITY_120',
// 	'pl_date_8',
// 	'pl_landuse_string',
// 	//	'station',
// 	'station_desc',
// 	'pl_by_auth_of',
// 	'pl_url',
// 	'shape_area',
// 	'quantity_delta_120',
// 	'quantity_delta_125',
// 	'last_update',
// 	'pl_order_print_version',
// 	'pl_tasrit_prn_version'
// ];

// const EPSG2039 = proj4.Proj(
// 	'+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-48,55,52,0,0,0,0 +units=m +no_defs'
// );

const EPSG3857 =
	'+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs';

// TODO: save the links of the new website and the old website
//const buildMavatURL = (serviceId, fieldsToFill, whereClause, return_geom)
const buildMavatURL = () => {
	// return `${BASE_AGS_URL}/${serviceId}/query?f=json&outFields=${fieldsToFill.join(
	// 	','
	// )}&returnGeometry=${return_geom}&where=${whereClause}&outSR=3857`;

	return 'https://ags.iplan.gov.il/arcgisiplan/rest/services/PlanningPublic/Xplan/MapServer/1/query?f=json&outFields=objectid,shape,plan_county_name,entity_subtype_desc,pl_number&returnGeometry=true&where=objectid%3E0&outSR=3857';
};


const getPlanMPID = (planUrl) => {
	var regex = 'https://mavat.iplan.gov.il/SV4/1/(.+)/310';
	const res = new RegExp(regex).exec(planUrl);
	if (res && res.length > 0) return res[1];
};

const getBlueLines = async () => {
	// we need MP_ID field to know the id in the new mavat website.
	// xplan doesn't have MP_ID in the polygons API (service id of 0)
	// so we query the centroid API (service id of 1) as well in order to get MP_ID.
	const urlWithPolygons = buildMavatURL();
	Log.info(`urlWithPolygons: ${urlWithPolygons}`);
	try {
		const responseWithPolygons = await axios.get(urlWithPolygons, options);
		const geojson = GeoJSON.fromEsri(responseWithPolygons.data, {});
		Log.info('mavat plans', { plans: geojson.features.length });

		// Need to populate all plans with their MP_ID
		// TODO- export to a mapping function
		for (const datum of geojson.features) {
			for (let prop in datum.properties) {
				datum.properties[prop.toUpperCase()] = datum.properties[prop];
				delete datum.properties[prop];
			}
			const agamId = datum.properties.MP_ID || getPlanMPID(datum.properties.PL_URL);
			if (agamId) {
				datum.properties.MP_ID = agamId;
				datum.properties.plan_new_mavat_url = datum.properties.PL_URL;
			}
		}
		return Bluebird.map(
			geojson.features,
			(datum) => Object.assign({}, datum, {
				geometry: reproject.toWgs84(datum.geometry, EPSG3857) })
		);

	} catch (error) {
		Log.error('Failed getting blue lines plans', error);
		return [];
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
	getPlanningCouncils,
	buildMavatURL
};
