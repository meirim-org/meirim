const Controller = require('../controller/controller');
const TreePermit = require('../model/tree_permit');
const tpc = require('../model/tree_permit_constants');
const { Knex } = require('../service/database');

class TreePermitController extends Controller {
	browse (req) {

		const { query } = req;

		const columns = [
			'id',
			tpc.PLACE,
			tpc.STREET,
			tpc.STREET_NUMBER,
			tpc.REASON_SHORT,
			tpc.REASON_DETAILED,
			tpc.PERSON_REQUEST_NAME,
			tpc.APPROVER_NAME,
			tpc.APPROVER_TITLE,
			tpc.PERMIT_ISSUE_DATE,
			tpc.PERMIT_NUMBER,
			tpc.REGIONAL_OFFICE,
			tpc.START_DATE,
			tpc.TOTAL_TREES,
			tpc.TREES_PER_PERMIT,
			tpc.ACTION,
			tpc.GEOM,
			tpc.GUSH,
			tpc.HELKA,
		];

		const where = {};
		// First order by days to permit start date for permits that are still applyable for public objection, then all the rest
		const orderByRaw = [Knex.raw('case when datediff(current_date(), tree_permit.start_date) > -1 then datediff(current_date(), tree_permit.start_date) else -1 end asc, start_date asc, id ')];

		if (query.PLACE) {
			where.PLACE = query.PLACE.split(',');
		}
		const whereNotIn = { [tpc.PLACE] : tpc.UNSUPPORTED_PLACES };
		return super.browse(req, {
			columns,
			where,
			whereNotIn,
			orderByRaw,
		});
	}

	place() {
		return Knex.raw(
			`SELECT ${tpc.PLACE}, COUNT(*) as num FROM ${tpc.TREE_PERMIT_TABLE} WHERE ${tpc.PLACE} NOT IN (${tpc.UNSUPPORTED_PLACES.map(p => `'${p}'`).join(',')}) GROUP BY ${tpc.PLACE}`
		).then(results => results[0]);
	}

}

module.exports = new TreePermitController(TreePermit);