const Plan = require('../api/model/plan');
const PlanAreaChangesController = require('../api/controller/plan_area_changes');

const populatePlanAreaChanges = async () => {
	try {
		const result = await Plan.query(qb => {
			qb.where('areaChanges', '!=', '[[]]').select('id','areaChanges');
		})
		.fetchAll();
		areaChanges = result.models;
		let howMuchLeft = areaChanges.length;
		for (let counter = 0; counter < areaChanges.length; counter++) {
			const planId = areaChanges[counter].attributes.id;
			const rawAreaChangesString = areaChanges[counter].attributes.areaChanges;
			console.log(`${howMuchLeft} plans left`);
			howMuchLeft--;
			await PlanAreaChangesController.refreshPlanAreaChanges(planId, rawAreaChangesString)
			
		}		
	}
	catch (err) {
		console.log(err);
	}

};

populatePlanAreaChanges().then(() => console.log('done populating plan area changes'));
