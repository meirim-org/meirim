const expect = require('chai').expect;
const { mockDatabase } = require('../../mock');
const { Plan } = require('../../../api/model');

describe('Plan controller', function() {
	const tables = ['alert', 'plan', 'notification', 'person', 'plan_person'];
	beforeEach(async function() {
		await mockDatabase.createTables(tables);
	});

	afterEach(async function() {
		await mockDatabase.dropTables(tables);
	});

	it('creates row in db successfuly', async function() {
		const { PlanController, SubscribtionController } = require('../../../api/controller');
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

		const req2 = {
			session: {
				person: {
					id: 1,
					admin: 1
				}
			}
		};

		const { attributes } = await PlanController.create(req);
		expect(attributes.OBJECTID).to.eql(req.body.OBJECTID);
		expect(attributes.PLAN_COUNTY_NAME).to.eql(req.body.PLAN_COUNTY_NAME);
		expect(attributes.PL_NUMBER).to.eql(req.body.PL_NUMBER);
		expect(attributes.PL_NAME).to.eql(req.body.PL_NAME);
		expect(attributes.data).to.eql(req.body.data);
		expect(attributes.jurisdiction).to.eql(req.body.jurisdiction);
		expect(attributes.areaChanges).to.eql(req.body.areaChanges);
		expect(attributes.rating).to.eql(req.body.rating);
		expect(attributes.sent).to.eql(0);
		const userPlansBeforeSubscribition = await SubscribtionController.getUserPlans(req2);
		expect(userPlansBeforeSubscribition).to.eql([]);
		await SubscribtionController.subscribe({ params: { id: attributes.id }, session: { person : { id: 1, admin: 1 } } });
		const secondPlan = await PlanController.create(req);
		await SubscribtionController.subscribe({ params: { id:  secondPlan.attributes.id }, session: { person : { id: 1, admin: 1 } } });
		const userPlansAfterSubscribition = await SubscribtionController.getUserPlans(req2);
		expect(userPlansAfterSubscribition.length).to.eql(2);
	});

	it('browse returns relevant plans', async function() {
		const { PlanController } = require('../../../api/controller');
		const req = {
			session: {
				person: {
					id: 1,
					admin: 1
				}
			},
			body: {
				OBJECTID: 1,
				PLAN_COUNTY_NAME: 'COUNTY_NAME_1',
				PL_NUMBER: '1-1',
				PL_NAME: 'name/1',
				data: 'data',
				geom: { 'type': 'Feature', 'properties': {}, 'geometry': { 'type': 'Polygon', 'coordinates': [[[35.29765605926514, 32.698333027553474], [35.29937267303467, 32.698333027553474], [35.29937267303467, 32.69898308437551], [35.29765605926514, 32.69898308437551], [35.29765605926514, 32.698333027553474]]] } },
				jurisdiction: 'juris',
				areaChanges: 'areachanges',
				rating: 2,
			}
		};

		const req2 = {
			session: {
				person: {
					id: 1,
					admin: 1
				}
			},
			body: {
				OBJECTID: 2,
				PLAN_COUNTY_NAME: 'COUNTY_NAME_1',
				PL_NUMBER: '2-2',
				PL_NAME: 'name/2',
				data: 'data',
				geom: { 'type': 'Feature', 'properties': {}, 'geometry': { 'type': 'Polygon', 'coordinates': [[[35.31010150909424, 32.707415336831616], [35.3116250038147, 32.707415336831616], [35.3116250038147, 32.70783060919105], [35.31010150909424, 32.70783060919105], [35.31010150909424, 32.707415336831616]]] } },
				jurisdiction: 'juris',
				areaChanges: 'areachanges',
				rating: 2,
			}
		};

		const req3 = {
			session: {
				person: {
					id: 1,
					admin: 1
				}
			},
			body: {
				OBJECTID: 3,
				PLAN_COUNTY_NAME: 'COUNTY_NAME_2',
				PL_NUMBER: '3-3',
				PL_NAME: 'name/3',
				data: 'data',
				geom: { 'type': 'Feature', 'properties': {}, 'geometry': { 'type': 'Polygon', 'coordinates': [[[35.293922424316406, 32.70541116914156], [35.29435157775879, 32.705320890258115], [35.29426574707031, 32.70517644385461], [35.2948236465454, 32.70521255547741], [35.29488801956177, 32.70544728066936], [35.294501781463616, 32.70559172663443], [35.29441595077515, 32.705465336427785], [35.293922424316406, 32.70541116914156]]] } },
				jurisdiction: 'juris',
				areaChanges: 'areachanges',
				rating: 2,
			}
		};

		await PlanController.create(req);
		await PlanController.create(req2);
		await PlanController.create(req3);

		// normal browse returns all plans ordered by id descending
		const req4 = {
			session: {
				person: {
					id: 1,
					admin: 1
				}
			},
			query: {}
		};
		const normalBrowsePlans = await PlanController.browse(req4);
		expect(normalBrowsePlans.length).to.eql(3);
		expect(normalBrowsePlans.models[0].attributes.PL_NUMBER).to.eql('3-3');
		expect(normalBrowsePlans.models[1].attributes.PL_NUMBER).to.eql('2-2');
		expect(normalBrowsePlans.models[2].attributes.PL_NUMBER).to.eql('1-1');

		// distance point browse returns plans at maximum distance from point
		const req5 = {
			session: {
				person: {
					id: 1,
					admin: 1
				}
			},
			query: {
				distancePoint: '35.297441482543945,32.70472504733656'
			}
		};
		const distanceBrowsePlans = await PlanController.browse(req5);
		expect(distanceBrowsePlans.length).to.eql(3);
		expect(distanceBrowsePlans.models[0].attributes.PL_NUMBER).to.eql('3-3');
		expect(distanceBrowsePlans.models[0].attributes.distance).to.eql(295.0618794770306);
		expect(distanceBrowsePlans.models[1].attributes.PL_NUMBER).to.eql('1-1');
		expect(distanceBrowsePlans.models[1].attributes.distance).to.eql(638.9232364670195);
		expect(distanceBrowsePlans.models[2].attributes.PL_NUMBER).to.eql('2-2');
		expect(distanceBrowsePlans.models[2].attributes.distance).to.eql(1439.1654446476325);

		// distance point browse should not return geo-search-filtered plans
		const firstPlan = await new Plan({ PL_NUMBER: '1-1' }).fetch();
		await firstPlan.set({ geo_search_filter: true });
		await firstPlan.save();

		const filteredDistanceBrowsePlans = await PlanController.browse(req5);
		expect(filteredDistanceBrowsePlans.length).to.eql(2);
		expect(filteredDistanceBrowsePlans.models[0].attributes.PL_NUMBER).to.eql('3-3');
		expect(filteredDistanceBrowsePlans.models[0].attributes.distance).to.eql(295.0618794770306);
		expect(filteredDistanceBrowsePlans.models[1].attributes.PL_NUMBER).to.eql('2-2');
		expect(filteredDistanceBrowsePlans.models[1].attributes.distance).to.eql(1439.1654446476325);
	});
});
