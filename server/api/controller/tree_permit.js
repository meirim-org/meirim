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
			tpc.LAST_DATE_TO_OBJECTION,
			tpc.TOTAL_TREES,
			tpc.TREES_PER_PERMIT,
			tpc.ACTION,

		];

		const where = {};
		const order = `-${tpc.START_DATE}`;

		if (query.PLACE) {
			where.PLACE = query.PLACE.split(',');
		}

		return super.browse(req, {
			columns,
			where,
			order
		});
	}

	place() {
		return Knex.raw(
			`SELECT ${tpc.PLACE}, COUNT(*) as num FROM ${tpc.TREE_PERMIT_TABLE} GROUP BY ${tpc.PLACE}`
		).then(results => results[0]);
	}

}

module.exports = new TreePermitController(TreePermit);