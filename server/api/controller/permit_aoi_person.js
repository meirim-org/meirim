const Controller = require('./controller');
const PermitAoiPerson = require('../model/permit_aoi_person');
const consts = require('../model/permit_constants');
const PermitPerson = require('../model/permit_person');
const Permit = require('../model/permit');
const PermitAoi = require('../model/permit_aoi');
const { Bookshelf } = require('../service/database');
const Exception = require('../model/exception');

class PermitAoiPersonController extends Controller {
	/**
		  * Return permit AOI person objects ordered by id. Must be logged in.
		  * @param {IncomingRequest} req
		  */
	browse(req) {
		if (!req.session.person) {
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
	create(req) {
		Bookshelf.transaction((t) => {
			PermitAoi.where({ id: req.body.permit_aoi_id, type: consts.REGION }).fetch({ columns: consts.NAME })
				.then((permitAoi) => {
					if (!permitAoi) {
						throw new Exception.NotFound('Missing Permit AOI, or not of region type')
					}

					const PermitPersons = Bookshelf.Collection.extend({ model: PermitPerson })
					super.create(req, t)

					return Permit.where({ region: permitAoi.get('name') }).fetchAll({ columns: 'id' })
				}).then((permits) => {
					const pps = PermitPerson.collection(
						permits.map(permit => ({ permit_id: permit.id, person_id: req.session.person.id }))
					)
					console.log(pps)
					return pps.invokeThen('save', null, { method: 'insert', transacting: t })
				})
				.catch((err) => console.error(err))
		})
	}
}

module.exports = new PermitAoiPersonController(PermitAoiPerson);