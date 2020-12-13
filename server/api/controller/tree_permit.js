const Controller = require('../controller/controller');
const TreePermit = require('../model/tree_permit');
const tpc = require('../model/tree_permit_constants');


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
			tpc.LAST_DATE_TO_OBJECTION,

		];

		const where = {};
		const order = '-id';

		return super.browse(req, {
			columns,
			where,
			order
		});
	}
}

module.exports = new TreePermitController(TreePermit);