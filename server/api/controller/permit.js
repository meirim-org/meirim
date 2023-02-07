const Controller = require('./controller');
const PermitPerson = require('../model/permit_person');
const consts = require('../model/permit_constants');
const Exception = require('../model/exception');

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
		const order = `-${consts.CREATED_AT}`

		return super.browse(req, {
			where,
			withRelated,
			order,
		}).then(permit_persons => {
			// Returning only the permit objects relevant to the current Person
			return permit_persons.map(permit_person => permit_person.related(consts.PERMIT_TABLE));
		});
	}
}

module.exports = new PermitController(PermitPerson);