const Controller = require('./controller');
const PermitAoi = require('../model/permit_aoi');
const consts = require('../model/permit_constants');
const Permit = require('../model/permit');
const Exception = require('../model/exception');

class PermitAoiController extends Controller {
	/**
		  * Return permit aoi objects ordered by name.
		  * @param {IncomingRequest} req
		  */
	browse(req) {
		const columns = [
			'id',
			consts.TYPE,
			consts.NAME,
		];

		const order = consts.NAME;

		return super.browse(req, {
			columns,
			order,
		});
	}

	/**
	 * Return a small sample of permits matching this AOI. Must be logged in.
	 * Currently works only for region type AOI
	 * @param {IncomingRequest} req
	 */
	preview(req) {
		const previewLimit = 3

		if (!req.session.person) {
			throw new Exception.NotAllowed('Must be logged in');
		}
		return this.model.where({ id: req.params.id, type: consts.REGION }).fetch({ columns: consts.NAME })
			.then((permitAoi) => {
				if (!permitAoi) {
					throw new Exception.NotFound('Missing Permit AOI, or not of region type')
				}

				return Permit
					.query(
						{ where: { region: permitAoi.get('name') }, orderBy: [consts.CREATED_AT, 'desc'] }
					).fetchPage({ limit: previewLimit })
			})
	}
}

module.exports = new PermitAoiController(PermitAoi);