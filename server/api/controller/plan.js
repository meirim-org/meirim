const Controller = require('../controller/controller');
const Plan = require('../model/plan');
const GJV = require('geojson-validation');
const { assign } = require('lodash');
const Config = require('../lib/config');
const { Knex } = require('../service/database');
const Exception = require('../model/exception');
const wkt = require('terraformer-wkt-parser');
const Tag = require('../model/tag');
const Log = require('../lib/log');

const columns = [
	'id',
	'PLAN_COUNTY_NAME',
	'PL_NUMBER',
	'PL_NAME',
	'PLAN_CHARACTOR_NAME',
	'geom',
	'plan_display_name'
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
				'status',
				'updated_at',
				'data'
			],
			withRelated: ['tags']
		};

		if (query.status) {
			q.where.status = query.status.split(',');
		}

		if (query.PLAN_COUNTY_NAME) {
			q.where.PLAN_COUNTY_NAME = query.PLAN_COUNTY_NAME.split(',');
		}

		if(query.distancePoint) {
			let points = query.distancePoint.split(',').map(i => parseFloat(i));

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
			// (mysql 5.7, mariadb) return the distance in units which need to be
			// multiplied to get an approximate meters value
			const spatialUnitFactor = Config.locationSearch.dbDistanceInMeters ? 1 : 111195;

			q.columns.push(Knex.raw(`ST_Distance(geom_centroid, ST_GeomFromText("${polygon}",4326))*${spatialUnitFactor} as distance`));

			q.orderByRaw = ['distance'];
			delete q.order;

			console.log("Config.locationSearch", Config.locationSearch)

			// use ST_Within to filter for plans with centroids within a polygon
			// created with ST_Buffer. this makes use of the index on geom_centroid
			q.whereRaw = [
				Knex.raw(`ST_Within(geom_centroid, ST_Buffer(ST_GeomFromText("${polygon}", 4326), ${Config.locationSearch.filterPlansRadiusKm || 10}*1000/${spatialUnitFactor}))`)
			];

			// filter out plans that should not be returned in geo search
			q.where.geo_search_filter = [false];
		}

		return super.browse(req, q).then(col => {
			col.models.forEach(planModel => {
				planModel.attributes.tags = planModel.relations.tags.models.map(tagModel => tagModel.attributes.name);
				delete planModel.relations;
			});
			
			return col;
		});
	}


	// attached tag_name into tags. The initial fetch brings only tags id, but we want the tags name.
	async afterFetch (collection) {

		// take all the unique tag ids, and get it into an array (set doesn't work in the db query later on)
		const relevantTagIds = Array.from(new Set(collection.models.map(planModel => {
			return planModel.relations.tags.models.map(relationTag => relationTag.attributes.tag_id);
		}).flat()));

		if (relevantTagIds.length === 0) {
			// we got no tags, so we got nothing to do here
			return collection;
		}

		try {
			const relevantTagsModels = await Tag.where('id', 'IN', relevantTagIds).fetchAll({ columns: ['id', 'name'] });

			const tagIdToTagName = {};
			relevantTagsModels.models.forEach(tagModel => {
				tagIdToTagName[tagModel.id] = tagModel.attributes.name;
			});

			collection.models.forEach(planModel => {
				planModel.relations.tags.models.forEach(planTagModel => {
					console.log(planTagModel.attributes.tag_id);
					if (planTagModel.attributes.tag_id in tagIdToTagName) {
						planTagModel.attributes.tag_name = tagIdToTagName[planTagModel.attributes.tag_id];
					}
					else {
						// we somehow didn't find this tag name and it will be an empty string
						planTagModel.attributes.tag_name = '';
					}
				});
			});
		}

		catch(e) {
			Log.error(`Error while doing afterEach in controller/plan: ${e}`);
		}

		return collection;
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
