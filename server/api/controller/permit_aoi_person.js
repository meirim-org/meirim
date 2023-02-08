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
	 * Create a permit AOI person record, and add the relevant permit person records. Must be logged in.
	 * Currently works only for region type AOI
	 * @param {IncomingRequest} req
	 */
	create(req) {
		return Bookshelf.transaction((t) => {
			return PermitAoi.where({ id: req.body.permit_aoi_id, type: consts.REGION }).fetch({ columns: consts.NAME })
				.then((permitAoi) => {
					if (!permitAoi) {
						throw new Exception.NotFound('Missing Permit AOI, or not of region type')
					}

					const insertPermitPersonSql = `
						INSERT INTO permit_person (permit_id, person_id) 
						SELECT id, ${req.session.person.id} from permit where region = '${permitAoi.get('name')}'
					`.trim()
					return Bookshelf.knex.raw(insertPermitPersonSql)
						.then(() => super.create(req, t))
				})
		})
	}

	/**
	 * Delete a permit AOI person record - removes all relevant permit person records as well. Must be logged in.
	 * @param {IncomingRequest} req
	 */
	delete(req) {
		return Bookshelf.transaction((t) => {
			return this.model.where({ id: req.params.id }).fetch()
				.then((permitAoiPerson) =>
					PermitAoi.where({ id: permitAoiPerson.get(consts.PERMIT_AOI_ID), type: consts.REGION }).fetch({ columns: consts.NAME })
				)
				.then((permitAoi) => {
					if (!permitAoi) {
						throw new Exception.NotFound('Missing Permit AOI, or not of region type')
					}

					const deletePermitPersonSql = `
						DELETE permit_person FROM permit_person 
						JOIN permit ON permit_person.permit_id = permit.id
						WHERE person_id = ${req.session.person.id} AND region = '${permitAoi.get('name')}'
					`
					return Bookshelf.knex.raw(deletePermitPersonSql)
						.then(() => super.delete(req, t))
				})
		})
	}
}

module.exports = new PermitAoiPersonController(PermitAoiPerson);