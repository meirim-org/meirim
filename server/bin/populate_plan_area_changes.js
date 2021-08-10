const Plan = require('../api/model/plan');
const PlanAreaChangesController = require('../api/controller/plan_area_changes');

const populatePlanAreaChanges = async () => {
	try {
		const result = await Plan.query(qb => {
			qb.where('areaChanges', '!=', '[[]]').select('id','areaChanges');
		})
		.fetchAll();
		const areaChanges = result.models;
		let howMuchLeft = areaChanges.length;

		console.log('starting to populate plan_area_changes table');
		for (let counter = 0; counter < areaChanges.length; counter++) {
			const planId = areaChanges[counter].attributes.id;
			const rawAreaChangesString = areaChanges[counter].attributes.areaChanges;

			await PlanAreaChangesController.refreshPlanAreaChanges(planId, rawAreaChangesString);
			howMuchLeft--;

			if (howMuchLeft % 100 === 0 && (howMuchLeft !== 0)) {
				console.log(`${howMuchLeft} plans left`);
			}

		}

		console.log('done populating plan_area_changes table');
	}
	catch (err) {
		console.log(err);
	}

};



if (require.main === module) {
	populatePlanAreaChanges().then(() => console.log('done populating plan area changes'));
}


module.exports = populatePlanAreaChanges;
