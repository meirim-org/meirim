const assert = require('chai').assert;

describe('Crawler', function() {
  let planController;
  let cronController;
  let planModel;

  let plans;

  before(function() {
    planController = require('../../api/controller/plan');
    cronController = require('../../api/controller/cron');
    planModel = require('../../api/model/plan');
  });

  after(async function() {
    // clean crawled plans
    if (plans) {
      for (let i = 0; i < plans.length; i++) {
        await planModel.forge({
          [planModel.prototype.idAttribute]: plans.at(i)[planModel.prototype.idAttribute]
        }).destroy({require: true});
      };
    }
  });

  it('should run', async function() {
    this.timeout(60000);

    // make sure there are currently no plans in the database
    plans = await planController.browse({query: {status: null, query: null}});
    assert.equal(plans.length, 0);

    // run crawler cron with limit of 5 plans
    await cronController.iplan(5);

    // now there should be 5 plans (with mavat data?)
    plans = await planController.browse({query: {status: null, query: null}});
    assert.equal(plans.length, 5);
  });
});
