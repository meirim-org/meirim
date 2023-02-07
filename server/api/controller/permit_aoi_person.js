const Controller = require('./controller');
const PermitAoiPerson = require('../model/permit_aoi_person');
const consts = require('../model/permit_constants');
const PermitPerson = require('../model/permit_person');
const Permit = require('../model/permit');
const PermitAoi = require('../model/permit_aoi');
const Bookshelf = require('bookshelf');
const Exception = require('../model/exception');

class PermitAoiPersonController extends Controller {
	/**
   	* Return permit AOI person objects ordered by id. Must be logged in.
   	* @param {IncomingRequest} req
   	*/
	browse (req) {
		if(!req.session.person) {
			throw new Exception.NotAllowed('Must be logged in');
		}

		const columns = [
			'id',
			consts.PERMIT_AOI_ID,
			consts.PERSON_ID,
			consts.NAME
		];

		const where = { [consts.PERSON_ID]: [req.session.person.id] };
		const withRelated = [consts.PERMIT_AOI_TABLE];
		const order = 'id';

		return super.browse(req, {
			columns,
			where,
			withRelated,
			order,
		});
	}

	/**
	 * Create a permit AOI person record, and add the relevant permit person records.
	 * Currently works only for region type AOI
	 * @param {IncomingRequest} req
	 */
	create (req) {
		const permitAoi = PermitAoi.where({ permit_aoi_id: req.body.permit_aoi_id, type: consts.REGION }).fetch({columns: consts.NAME})
		if(!permitAoi) {
			throw new Exception.NotFound('Missing Permit AOI, or not of region type')
		}
		
		const PermitPersons = PermitPerson.collection.extend({ model: PermitPerson })
		Bookshelf.transaction((t) => {
			super.create(req, t)
			const permitIds = Permit.where({ region: permitAoi.name }).fetchAll({ columns: 'id' }).pluck('id')
			PermitPersons.forge(
				permitIds.map(permitId => ({ permit_id: permitId, person_id: req.session.person.id }))
				).save(null, { transacting: t })
		})
	}
}

module.exports = new PermitAoiPersonController(PermitAoiPerson);