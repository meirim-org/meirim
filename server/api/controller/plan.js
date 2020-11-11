const Controller = require('../controller/controller');
const Plan = require('../model/plan');
const GJV = require('geojson-validation'); 
const Config = require('../lib/config');
const { Knex } = require('../service/database');
const Exception = require('../model/exception');
const wkt = require('terraformer-wkt-parser');

const columns = [
	'id',
	'PLAN_COUNTY_NAME',
	'PL_NUMBER',
	'PL_NAME',
	'PLAN_CHARACTOR_NAME',
	'geom'
];

class PlanController extends Controller {

	browse (req) {
		const { query } = req;
		const where = {};

		if (query.status) {
			where.status = query.status.split(',');
		}

		if (query.PLAN_COUNTY_NAME) {
			where.PLAN_COUNTY_NAME = query.PLAN_COUNTY_NAME.split(',');
		}
		const order = '-id';

		return super.browse(req, {
			columns,
			where,
			order
		});
	}

	publicBrowse (req) {

		const { query } = req;
		const response = {
			type: 'FeatureCollection',
			bbox: [],
			features: []
		};

		if (!query.polygon) {
			throw new Exception.BadRequest('Missing polygon and point params');
		}

		const points = req.query.polygon.split(';').map((i) => i.split(',').map((i) => parseFloat(i)));
		const geojson = {
			type: 'Polygon',
			coordinates: [points]
		};
		if(!GJV.valid(geojson)){
			throw new Exception.BadRequest('polygon is invalid'); 
		}
		const polygon = wkt.convert(geojson);
		const whereRaw = [
			Knex.raw(`ST_Intersects(geom, ST_GeomFromText("${polygon}",4326))`)
		];
		const order = '-id';

		return super
			.browse(req, {
				columns,
				whereRaw,
				order,
				pageSize: 1000
			})
			.then(rows => {
				response.features = rows.map(row => ({
					type: 'Feature',
					properties: {
						uri: `${Config.general.domain}plan/${row.get('id')}/`,
						name: row.get('PL_NAME'),
						county: row.get('PLAN_COUNTY_NAME'),
						number: row.get('PL_NUMBER')
					},
					geometry: row.get('geom')
				}));
				return response;
			});
	}

	publicBrowseDistance (req) {
		const { query } = req;
		const response = {
			type: 'FeatureCollection',
			bbox: [],
			features: []
		};

		if (!query.point){
			throw new Exception.BadRequest('Missing point params');
		}

		let points = query.point.split(',').map(i => parseFloat(i))
		const geojson = {
			type: 'Point',
			coordinates: points
		};
		if(!GJV.valid(geojson)){
			throw new Exception.BadRequest('point is invalid'); 
		}
		const polygon = wkt.convert(geojson);
		
		return super
			.browse(req, {
				columns:[...columns, Knex.raw(`ST_Distance(geom, ST_GeomFromText("${polygon}",4326)) as distance`)],
				orderByRaw:['distance'],
				pageSize: 10
			})
			.then(rows => {
				response.features = rows.map(row => ({
					type: 'Feature',
					properties: {
						uri: `${Config.general.domain}plan/${row.get('id')}/`,
						name: row.get('PL_NAME'),
						county: row.get('PLAN_COUNTY_NAME'),
						number: row.get('PL_NUMBER')
					},
					geometry: row.get('geom')
				}));
				return response;
			});
	}

	county () {
		return Knex.raw(
			'SELECT PLAN_COUNTY_NAME, COUNT(*) as num FROM plan GROUP BY PLAN_COUNTY_NAME'
		).then(results => results[0]);
	}

	statuses () {
		return Knex.raw(
			'SELECT status, COUNT(*) as num  FROM plan GROUP BY status'
		).then(results => results[0]);
	}

	mapResult(){

	}
}

module.exports = new PlanController(Plan);
