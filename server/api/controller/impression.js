const Bluebird = require('bluebird');
const Controller = require('../controller/controller');
const Impression = require('../model/impression');
const Plan = require('../model/plan');
const { Knex } = require('../service/database');

const hashCode = (s) => {
	var hash = 0;
	if (s.length === 0) {
		return hash;
	}
	for (var i = 0; i < s.length; i++) {
		var char = s.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};
const getIp = (req) => {
	return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};
class ImpressionController extends Controller {
	create (req) {
		const body = req.body;
		body.plan_id = parseInt(req.params.plan_id, 10);
		body.ip = hashCode(getIp(req));
		return (
			this.model
				.forge(body)
				.save()
			// we don't want to return data
				.then(() => true)
		);
	}

	/**
     * Aggregate impressions and update view count in plan table.
     * Should be executed by cron every day.
     * This should not be run every hour since we erode the views.
     */
	aggregate () {
		// update views to get a relative
		return Plan.erodeViews()
		// get new impressions, remove them and update plan table
			.then(() => Knex.transaction((trx) => {
				// get aggregated count for every plan
				const query = 'SELECT plan_id, COUNT(DISTINCT ip) as num FROM impression GROUP BY plan_id';
				return trx
					.raw(query)
				// remove impressions and return the results of the select query
					.then((results) => trx.raw('TRUNCATE impression').then(() => results))
				// get the aggregated impressions and update the plans table
					.then((results) => {
						// map plans by views
						const map = results[0].reduce((acc, item) => {
							if (acc[item.num]) {
								acc[item.num].push(item.plan_id);
							} else {
								acc[item.num] = [item.plan_id];
							}
							return acc;
						}, {});

						// build update queries
						const queries = Object.keys(map).map(
							(key) => `UPDATE plan SET
								  views=views+${key},
								  erosion_views=erosion_views +${key}
								  WHERE id IN(${map[key].join(',')})`
						);

						// update the plan table
						return Bluebird.mapSeries(queries, (query) =>
							trx.raw(query)
						);
					});
			})
			);
	}
}

module.exports = new ImpressionController(Impression);
