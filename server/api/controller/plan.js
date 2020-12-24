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
		let q = {
			where:{},
			order: '-id',
			columns: [...columns,
				'goals_from_mavat',
				'main_details_from_mavat',
			]
		}

		if (query.status) {
			q.where.status = query.status.split(',');
		}

		if (query.PLAN_COUNTY_NAME) {
			q.where.PLAN_COUNTY_NAME = query.PLAN_COUNTY_NAME.split(',');
		}

		if(query.distancePoint){

			let points = query.distancePoint.split(',').map(i => parseFloat(i))

			const geojson = {
				type: 'Point',
				coordinates: points
			};
	
			if(!GJV.valid(geojson)){
				throw new Exception.BadRequest('point is invalid'); 
			}
			const polygon = wkt.convert(geojson);

			// some databases (mysql 8) already support returning ST_Distance in meters
			// if the geometries are in the same system of reference, and others
			// (mysql 5.7, mariadb) return the distance in degrees and need to be
			// multiplied to get an approximate meters value
			if (Config.database.dbDistanceInMeters) {
				q.columns.push(Knex.raw(`ST_Distance(geom, ST_GeomFromText("${polygon}",4326)) as distance`))
			} else {
				q.columns.push(Knex.raw(`ST_Distance(geom, ST_GeomFromText("${polygon}",4326))*111195 as distance`))
			}

			q.orderByRaw = ['distance']
			delete q.order
		}

		return super.browse(req, q);
	}

	publicBrowse (req) {
		
		const { query } = req;
		const response = {
			type: 'FeatureCollection',
			bbox: [],
			features: []
		};

		if (!query.polygon) {
			throw new Exception.BadRequest('Missing polygon param');
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
}

module.exports = new PlanController(Plan);
