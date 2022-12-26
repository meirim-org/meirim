const Controller = require('./controller');
const Permit = require('../model/permit');
const consts = require('../model/permit_constants');
const { Knex } = require('../service/database');

class PermitController extends Controller {
	browse (req) {

		const columns = [
			'id',
			consts.SUBJECT,
			consts.CREATED_AT,
			consts.REGION,
			consts.REAL_ESTATE,
			consts.AUTHOR,
			consts.STATUS,
			consts.TIMELINE,
			consts.IMPORTANCE,
		];

		const where = {};
		// First order by days to permit start date for permits that are still applyable for public objection, then all the rest
		// const orderByRaw = [Knex.raw('case when datediff(current_date(), permit.last_date_to_objection) > -1 then datediff(current_date(), permit.last_date_to_objection) else -1 end asc, last_date_to_objection asc, id ')];

		return super.browse(req, {
			columns,
			where,
			// orderByRaw,
		});
	}
}

module.exports = new PermitController(Permit);