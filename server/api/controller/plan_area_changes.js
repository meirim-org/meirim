const Log = require('../lib/log');
const Controller = require('../controller/controller');
const PlanAreaChanges = require('../model/plan_area_changes');

class PlanAreaChangesController extends Controller {

    static async refreshPlanAreaChanges (planId, rawAreaChangesString) {
        await PlanAreaChanges.deleteByPlan(planId);
        try {
            if (rawAreaChangesString) {
                let areaChangesArray = JSON.parse(rawAreaChangesString)[0];
                let areaChanges = [];
                for (let iChanges = 0; iChanges < areaChangesArray.length; iChanges++) {
                    areaChanges.push(
                        {
                            "plan_id": planId,
                            "usage": areaChangesArray[iChanges]['3'],
                            "measurement_unit": areaChangesArray[iChanges]['4'],
                            "approved_state": areaChangesArray[iChanges]['5'],
                            "change_to_approved_state": areaChangesArray[iChanges]['6'],
                            "total_in_detailed_plan": areaChangesArray[iChanges]['7'],
                            "total_in_mitaarit_plan": areaChangesArray[iChanges]['8'],
                            "remarks": areaChangesArray[iChanges]['9'],
                        }
                    )
                }
                await PlanAreaChanges.createPlanAreaChanges(areaChanges);
            }
        } catch (err) {
            Log.error(err);
        }
    }	
}

module.exports = PlanAreaChangesController;
