const Controller = require('../controller/controller');
const TreePermit = require('../model/tree_permit');
const tpc = require('../model/tree_permit_constants');
const { Knex } = require('../service/database');

class TreePermitController extends Controller {
	browse (req) {
		const columns = [
			'id',
			tpc.PLACE,
			tpc.STREET,
			tpc.STREET_NUMBER,
			tpc.TREE_NAME,
			tpc.NUMBER_OF_TREES,
			tpc.REASON_SHORT,
			tpc.REASON_DETAILED,
			tpc.PERSON_REQUEST_NAME,
			tpc.APPROVER_NAME,
			tpc.APPROVER_TITLE,
			tpc.PERMIT_ISSUE_DATE,
			tpc.PERMIT_NUMBER,
			tpc.REGIONAL_OFFICE,
			tpc.LAST_DATE_TO_OBJECTION,

		];

		const where = {};
		const order = `-${tpc.LAST_DATE_TO_OBJECTION}`;

		return super.browse(req, {
			columns,
			where,
			order
		});
	}

	place() {
		return Knex.raw(
			`SELECT ${tpc.PLACE}, COUNT(*) as num FROM tree_permit GROUP BY ${tpc.PLACE}`
		).then(results => results[0]);
	}

}

module.exports = new TreePermitController(TreePermit);