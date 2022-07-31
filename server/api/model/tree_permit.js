const Model = require('./base_model');
const tpc = require('./tree_permit_constants');
const Log = require('../lib/log');
const { Knex } = require('../service/database');

class TreePermit extends Model {

	get rules() {
		return {

			[tpc.REGIONAL_OFFICE]: 'string',
			[tpc.PERMIT_NUMBER]: 'string',
			[tpc.ACTION]: 'string', // cutting , copying
			[tpc.PERMIT_ISSUE_DATE]: 'string',
			[tpc.PERSON_REQUEST_NAME]: 'string',
			[tpc.START_DATE]: ['required', 'string'],
			[tpc.END_DATE]: 'string',
			[tpc.LAST_DATE]: 'string',
			[tpc.LAST_DATE_TO_OBJECTION] : 'string',
			[tpc.APPROVER_NAME]: 'string',
			[tpc.APPROVER_TITLE]: 'string',

			[tpc.SENT]: 'integer',
			[tpc.URL]: 'string',

			// Location
			[tpc.PLACE]: 'string',
			[tpc.STREET]: 'string',
			[tpc.STREET_NUMBER]: 'string',
			[tpc.GUSH]: 'string',
			[tpc.HELKA]: 'string',
			[tpc.GEOM]: 'object',
			
			// Trees details
			[tpc.TREES_PER_PERMIT]: 'required',
			[tpc.TOTAL_TREES]: 'integer',
			[tpc.REASON_SHORT]: 'string',
			[tpc.REASON_DETAILED]: 'string',
			[tpc.COMMENTS_IN_DOC]: 'string'
		};
	}

	get tableName () {
		return `${tpc.TREE_PERMIT_TABLE}`;
	}

	_saving () {
		//return new Checkit(model.rules).run(model.attributes);
	}
	// support json encode for data field
	format (attributes) {
		if (attributes[tpc.TREES_PER_PERMIT]) {
			attributes[tpc.TREES_PER_PERMIT] = JSON.stringify(attributes[tpc.TREES_PER_PERMIT]);
		}
		if (attributes[tpc.GEOM]) {
			attributes[tpc.GEOM] = Knex.raw('ST_GeomFromGeoJSON(?)', [
				JSON.stringify(attributes[tpc.GEOM])
			]);
		}
		return super.format(attributes);
	}

	// support json encode for data field
	parse (attributes) {
		try {
			if (attributes[tpc.TREES_PER_PERMIT]) {
				attributes[tpc.TREES_PER_PERMIT] = JSON.parse(attributes[tpc.TREES_PER_PERMIT]);
			}
			if (attributes[tpc.GEOM]) {
				attributes[tpc.GEOM] = { type: 'Polygon',
					coordinates: [attributes[tpc.GEOM][0].map(r => [r.x, r.y])]
				};
			}
		} catch (e) {
			Log.error('Json parse error', attributes[tpc.TREES_PER_PERMIT]);
		}
		return super.parse(attributes);
	}

	defaults () {
		return {
			sent: 0
		};
	}

	canRead () {
		return Promise.resolve(this);
	}

	static getUnsentTreePermits (userOptions) {
		const options = userOptions || {};
		if (!options.limit) {
			options.limit = 1;
		}
		//const where = Knex.raw('');
		return TreePermit.query(qb => {
			qb.whereRaw('sent = 0 AND datediff(current_date(), tree_permit.start_date) < -1');
		
		}).fetchPage({
			pageSize: options.limit,
			columns: [
				'id',
				tpc.PLACE,
				tpc.TOTAL_TREES,
				tpc.TREES_PER_PERMIT,
				tpc.STREET,
				tpc.STREET_NUMBER,
				tpc.REASON_SHORT,
				tpc.REASON_DETAILED,
				tpc.START_DATE,
				tpc.PERMIT_NUMBER,
				tpc.GEOM,
				tpc.ACTION,
				tpc.LAST_DATE_TO_OBJECTION,
			]
		});
	}

	static markTreesAsSent (tree_ids) {
		return new TreePermit()
			.query(qb => {
				qb.whereIn('id', tree_ids);
			})
			.save(
				{
					sent: '2'
				},
				{
					method: 'update'
				}
			);
	}

}

module.exports = TreePermit;
