
const PlanAreaChangesController = require('../api/controller/plan_area_changes');
const { Knex } = require('../api/service/database');





const populatePlanAreaChanges = async () => {
	try {
		const knexRes = await Knex.raw(`SELECT id, areaChanges
		FROM plan
		WHERE areaChanges!='[[]]'`);

		const idsAndChanges = knexRes[0];
		let howMuchLeft = idsAndChanges.length;
		for (const {id: planId, areaChanges: rawAreaChangesString} of idsAndChanges) {
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
