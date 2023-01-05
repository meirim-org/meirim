const Controller = require('./controller');
const PermitPerson = require('../model/permit_person');
const consts = require('../model/permit_constants');

class PermitController extends Controller {
	/**
   	* Return person's alerts. Must be logged in.
   	* @param {IncomingRequest} req
   	*/
	browse (req) {
		if(!req.session.person) {
			throw new Exception.NotAllowed('Must be logged in');
		}

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

		const where = { [consts.PERSON_ID]: [req.session.person.id] };
		const withRelated = { [consts.PERMIT_TABLE]: qb => qb.columns(columns)};
		// First order by days to permit start date for permits that are still applyable for public objection, then all the rest
		// const orderByRaw = [Knex.raw('case when datediff(current_date(), permit.last_date_to_objection) > -1 then datediff(current_date(), permit.last_date_to_objection) else -1 end asc, last_date_to_objection asc, id ')];

		return super.browse(req, {
			where,
			withRelated,
			debug: true,
			// orderByRaw,
		}).then(permit_persons => {
			// Returning only the permit objects relevant to the current Person
			return permit_persons.map(permit_person => permit_person.related(consts.PERMIT_TABLE));
		});
	}
}

module.exports = new PermitController(PermitPerson);