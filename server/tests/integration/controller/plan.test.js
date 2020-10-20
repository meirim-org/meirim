
const expect = require('chai').expect;
const { mockDatabase } = require('../../mock');

describe('Plan controller', function() {
	const tables = ['alert', 'plan', 'notification', 'person'];
	beforeEach(async function() {
		await mockDatabase.dropTables(tables);
		await mockDatabase.createTables(tables);
	});

	afterEach(async function() {
		await mockDatabase.dropTables(tables);
	});

	it('creates row in db successfuly', async function() {
		const {PlanController} = require('../../../api/controller');
		const req = {
			session: {
				person: { 
					id: 1,
					admin: 1
				} 
			},
			body: {
				OBJECTID: 1,
				PLAN_COUNTY_NAME: 'COUNTNAME',
				PL_NUMBER: 'plannumber',
				PL_NAME: 'planname',
				data: 'data',
				// geom:{prop:'imobj'},
				jurisdiction: 'juris',
				areaChanges: 'areachanges',
				rating: 2,
			}
		};
		const {attributes} = await PlanController.create(req);
		expect(attributes.OBJECTID).to.eql(req.body.OBJECTID);
		expect(attributes.PLAN_COUNTY_NAME).to.eql(req.body.PLAN_COUNTY_NAME);
		expect(attributes.PL_NUMBER).to.eql(req.body.PL_NUMBER);
		expect(attributes.PL_NAME).to.eql(req.body.PL_NAME);
		expect(attributes.data).to.eql(req.body.data);
		expect(attributes.jurisdiction).to.eql(req.body.jurisdiction);
		expect(attributes.areaChanges).to.eql(req.body.areaChanges);
		expect(attributes.rating).to.eql(req.body.rating);
		expect(attributes.sent).to.eql(0);
	});
});