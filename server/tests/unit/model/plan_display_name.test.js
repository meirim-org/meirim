const { Plan } = require('../../../api/model');
const assert = require('assert');


describe('Plan Display Name', function() {

	it('test1', function() {
		const planName = 'רע/מק/823 - הרצל 6';
		assert.strictEqual(Plan.cleanPlanName(planName), 'הרצל 6');
	});

	it('test2', function () {
		const planName = 'ג/23606 אוהל יעל';
		assert.strictEqual(Plan.cleanPlanName(planName), 'אוהל יעל');
	});

	it('test3', function () {
		const planName = 'נת/מק/33/700/א - איחוד וחלוקה ברחוב אהרוני פינת נילי- רמת טיומקין';
		assert.strictEqual(Plan.cleanPlanName(planName), 'איחוד וחלוקה ברחוב אהרוני פינת נילי- רמת טיומקין');
	});

	it('test4', function () {
		const planName = 'שינויים ותוספות ברח\' הרב קוק 6-בב/מק/3311';
		assert.strictEqual(Plan.cleanPlanName(planName), 'שינויים ותוספות ברח\' הרב קוק 6');
	});

	it('test5', function () {
		const planName = 'צומת הרחובות הרב קוק וז\'בוטנסקי הר/מק/2280';
		assert.strictEqual(Plan.cleanPlanName(planName), 'צומת הרחובות הרב קוק וז\'בוטנסקי');
	});

	it('test6', function () {
	    const planName = 'חפ/מק/848 ה\' - חנות שופרסל, שד\' דגניה 14, ק.חיים';
	    assert.strictEqual(Plan.cleanPlanName(planName), 'חנות שופרסל, שד\' דגניה 14, ק.חיים');
	});

	it('test7', function () {
        const planName = 'חפ/2129 א\' - רח\' פבזנר 39, בית חולים סיעודי, חיפה';
        assert.strictEqual(Plan.cleanPlanName(planName), 'רח\' פבזנר 39, בית חולים סיעודי, חיפה');
    });


	it('should do nothing', function () {
		const planName = 'קיטרוני 47 - תוספת יח"ד';
		assert.strictEqual(Plan.cleanPlanName(planName), planName);
	});

});