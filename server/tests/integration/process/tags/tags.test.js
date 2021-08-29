const expect = require('chai').expect;
const sinon = require('sinon');
const { isTagByUsageAddition } = require('../../../../api/lib/tags/utils');
const { tagDataRules, area_change_types } = require('../../../../api/constants');
const { doesTagApply: isHousing, TAG_NAME: housingTagName  } = require('../../../../api/lib/tags/housing');
const PlanAreaChanges = require('../../../../api/model/plan_area_changes');


const planId = 1;
const plan = {id: planId};
const fakeUnitsAdded = 11;
const fakeSqMrAdded = 1001;
// Housing
const HOUSING_TAG_NAME = 'דיור';
const fakeHousingByUnitsTrue = { models: [{ attributes : { change_to_approved_state: `+${fakeUnitsAdded}` } }]} ;
const fakeHousingByAreaTrue = { models: [{ attributes : { change_to_approved_state: `+${fakeSqMrAdded}` } }]} ;
const HOUSING_BY_UNIT_RULE = tagDataRules.filter(tag => {return tag.tagName===HOUSING_TAG_NAME})[0].rules.filter( rule => {return rule.usage==='מגורים (יח"ד)'})[0];
const HOUSING_BY_AREA_RULE = tagDataRules.filter(tag => {return tag.tagName===HOUSING_TAG_NAME})[0].rules.filter( rule => {return rule.usage==='מגורים (מ"ר)'})[0];;  
// Public Area
const PUBLIC_TAG_NAME = 'מבני ציבור';
const fakePublicByAreaTrue = { models: [{ attributes : { change_to_approved_state: `+${fakeSqMrAdded}` } }]} ;
const PUBLIC_BY_AREA_RULE = tagDataRules.filter(tag => {return tag.tagName===PUBLIC_TAG_NAME})[0].rules.filter( rule => {return rule.changeType===area_change_types.INCREASED_USAGE})[0];
// Employment Area
const EMPLOYMENT_TAG_NAME = 'תעסוקה ותעשיה';
const fakeEmploymentByAreaFalse = { models: [{ attributes : { change_to_approved_state: `+1,500` } }]} ;
const EMPLOYMENT_BY_AREA_RULE_INCREASED_USAGE = tagDataRules.filter(tag => {return tag.tagName=== EMPLOYMENT_TAG_NAME})[0].rules.filter( rule => {return rule.changeType===area_change_types.INCREASED_USAGE})[0];
const EMPLOYMENT_BY_AREA_RULE_NEW_USAGE = tagDataRules.filter(tag => {return tag.tagName=== EMPLOYMENT_TAG_NAME})[0].rules.filter( rule => {return rule.changeType===area_change_types.NEW_USAGE})[0];
// Commerce Area
const COMMERCE_TAG_NAME = 'מסחר';
const COMMERCE_BY_AREA_RULE_INCREASED_USAGE = tagDataRules.filter(tag => {return tag.tagName=== COMMERCE_TAG_NAME})[0].rules.filter( rule => {return rule.changeType===area_change_types.INCREASED_USAGE})[0];
const COMMERCE_BY_AREA_RULE_NEW_USAGE = tagDataRules.filter(tag => {return tag.tagName===COMMERCE_TAG_NAME})[0].rules.filter( rule => {return rule.changeType===area_change_types.NEW_USAGE})[0];
const COMMERCE_BY_AREA_RULE_PERCENT_INCREASE = tagDataRules.filter(tag => {return tag.tagName=== COMMERCE_TAG_NAME})[0].rules.filter( rule => {return rule.changeType===area_change_types.PERCENT_INCREASE})[0];
// Hoteliery Area
const HOTELIERY_TAG_NAME = 'תיירות';
const HOTELIERY_BY_AREA_RULE_INCREASED_USAGE = tagDataRules.filter(tag => {return tag.tagName=== HOTELIERY_TAG_NAME})[0].rules.filter( rule => {return rule.changeType===area_change_types.INCREASED_USAGE})[0];
const HOTELIERY_BY_AREA_RULE_NEW_USAGE = tagDataRules.filter(tag => {return tag.tagName=== HOTELIERY_TAG_NAME})[0].rules.filter( rule => {return rule.changeType===area_change_types.NEW_USAGE})[0];;
const HOTELIERY_BY_AREA_RULE_PERCENT_INCREASE = tagDataRules.filter(tag => {return tag.tagName=== HOTELIERY_TAG_NAME})[0].rules.filter( rule => {return rule.changeType===area_change_types.PERCENT_INCREASE})[0];



describe('Tags', function() {
	describe(`isTagByUsageAddition helper function`, function() { 
		let myStub;
		afterEach(async function() {
			myStub.restore();
			sinon.restore();
		});

		describe(`"${HOUSING_TAG_NAME}" tag`, function() { 
			it(`returns "${HOUSING_TAG_NAME}" tag for housingByUnits if database record is found & # of units exceeds minimum`, async function() {
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeHousingByUnitsTrue);
				const result =  await isTagByUsageAddition(plan,HOUSING_BY_UNIT_RULE); 
				expect(result.created_by_data_rules).to.eql(`{rule:'${HOUSING_BY_UNIT_RULE.description}',detail:'adds +${fakeUnitsAdded} מגורים (יח"ד)'}`);
				myStub.restore();			
			});

			it(`does not return "${HOUSING_TAG_NAME}" tag for housingByUnits if number of units doesn\'t meet minimum`, async function() {
				const fakeUnitsAddedTooSmall = 5;
				const fakeHousingByUnitsTooSmall = { models: [{ attributes : { change_to_approved_state: `+${fakeUnitsAddedTooSmall}` } }]} ;
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeHousingByUnitsTooSmall);
				const result =  await isTagByUsageAddition(plan,HOUSING_BY_UNIT_RULE); 
				expect(result).to.eql(undefined);
				myStub.restore();			
			}); 
			
			it(`does not return "${HOUSING_TAG_NAME}" tag for housingByUnits if database record is not found`, async function() {
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(null);
				const result =  await isTagByUsageAddition(plan,HOUSING_BY_UNIT_RULE); 
				expect(result).to.eql(undefined);
				myStub.restore();			
			});		   

			it(`returns "${HOUSING_TAG_NAME}" tag for housingByArea if database record is found & area added is larger than minimum`, async function() {
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeHousingByAreaTrue);
				const result =  await isTagByUsageAddition(plan,HOUSING_BY_AREA_RULE); 
				expect(result.created_by_data_rules).to.eql(`{rule:'${HOUSING_BY_AREA_RULE.description}',detail:'adds +${fakeSqMrAdded} מגורים (מ"ר)'}`);
			});	

			it(`does not return "${HOUSING_TAG_NAME}" tag for housingByArea if area added doesn't meet minimum`, async function() {
				const fakeAreaAddedTooSmall = 500;
				const fakeHousingByAreaTooSmall = { models: [{ attributes : { change_to_approved_state: `+${fakeAreaAddedTooSmall}` } }]} ;
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeHousingByAreaTooSmall);
				const result =  await isTagByUsageAddition(plan,HOUSING_BY_AREA_RULE); 
				expect(result).to.eql(undefined);
				myStub.restore();			
			}); 
			
			it(`does not return "${HOUSING_TAG_NAME}" tag for housingByArea if database record is not found`, async function() {
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(null);
				const result =  await isTagByUsageAddition(plan,HOUSING_BY_AREA_RULE); 
				expect(result).to.eql(undefined);
				myStub.restore();			
			});
		});

		describe(`"${PUBLIC_TAG_NAME}" tag`, function() { 
			it(`returns "${PUBLIC_TAG_NAME}" tag if area added exceeds minimum`, async function() {
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakePublicByAreaTrue);
				const result =  await isTagByUsageAddition(plan,PUBLIC_BY_AREA_RULE); 
				expect(result.created_by_data_rules).to.eql(`{rule:'${PUBLIC_BY_AREA_RULE.description}',detail:'adds +${fakeSqMrAdded} ${PUBLIC_BY_AREA_RULE.usage}'}`);
				myStub.restore();			
			});
		});

		describe(`"${COMMERCE_TAG_NAME}" tag`, function() { 
			it(`does not return "${COMMERCE_TAG_NAME}" tag if increased usage area is less than minimum`, async function() {
				const addsSqMr = 99;
				const fakeByAreaFalse = { models: [{ attributes : { change_to_approved_state: `+${addsSqMr}` , approved_state:'100'} }]} ;
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeByAreaFalse);
				const result =  await isTagByUsageAddition(plan,COMMERCE_BY_AREA_RULE_INCREASED_USAGE); 
				expect(result).to.eql(undefined);
				myStub.restore();			
			});

			it(`returns "${COMMERCE_TAG_NAME}" tag if increased usage exceeds minimum`, async function() {
				const addsSqMr = 101;
				const fakeByAreaTrue = { models: [{ attributes : { change_to_approved_state: `+${addsSqMr}`, approved_state:'100' } }]} ;
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeByAreaTrue);
				const result =  await isTagByUsageAddition(plan,COMMERCE_BY_AREA_RULE_INCREASED_USAGE); 
				expect(result.created_by_data_rules).to.eql(`{rule:'${COMMERCE_BY_AREA_RULE_INCREASED_USAGE.description}',detail:'adds +${addsSqMr} ${COMMERCE_BY_AREA_RULE_INCREASED_USAGE.usage}'}`);
				myStub.restore();			
			});		

			it(`does not return "${COMMERCE_TAG_NAME}" tag if brand new commerce area is less than 1'`, async function() {
				const addsSqMr = 0;
				const fakeByAreaFalse = { models: [{ attributes : { change_to_approved_state: `+${addsSqMr}` , approved_state:''} }]} ;
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeByAreaFalse);
				const result =  await isTagByUsageAddition(plan,COMMERCE_BY_AREA_RULE_NEW_USAGE); 
				expect(result).to.eql(undefined);
				myStub.restore();			
			});	
			
			it(`returns "${COMMERCE_TAG_NAME}" tag if area added exceeds minimum as new usage`, async function() {
				const addsSqMr = 10;
				const fakeByAreaTrue = { models: [{ attributes : { change_to_approved_state: `+${addsSqMr}`, approved_state:'' } }]} ;
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeByAreaTrue);
				const result =  await isTagByUsageAddition(plan,COMMERCE_BY_AREA_RULE_NEW_USAGE); 
				expect(result.created_by_data_rules).to.eql(`{rule:'${COMMERCE_BY_AREA_RULE_NEW_USAGE.description}',detail:'adds +${addsSqMr} ${COMMERCE_BY_AREA_RULE_NEW_USAGE.usage}'}`);
				myStub.restore();			
			});			
			
			it(`does not return commerce tag if percent increase is less than 20%`, async function() {
				const addsSqMr = 190;
				const fakeByAreaFalse = { models: [{ attributes : { change_to_approved_state: `+${addsSqMr}` , approved_state:'1000'} }]} ;
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeByAreaFalse);
				const result =  await isTagByUsageAddition(plan,COMMERCE_BY_AREA_RULE_PERCENT_INCREASE); 
				expect(result).to.eql(undefined);
				myStub.restore();			
			});		

			it(`returns commerce tag if brand new commerce area is more than 20%`, async function() {
				const addsSqMr = 100;
				const fakeByAreaTrue = { models: [{ attributes : { change_to_approved_state: `+${addsSqMr}` , approved_state:'50'} }]} ;
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeByAreaTrue);
				const result =  await isTagByUsageAddition(plan,COMMERCE_BY_AREA_RULE_PERCENT_INCREASE); 
				expect(result.created_by_data_rules).to.eql(`{rule:'${COMMERCE_BY_AREA_RULE_PERCENT_INCREASE.description}',detail:'adds +${addsSqMr} ${COMMERCE_BY_AREA_RULE_PERCENT_INCREASE.usage}'}`);
				myStub.restore();			
			});			
		});	

		describe(`"${HOTELIERY_TAG_NAME}" tag`, function() { 
			it(`does not return "${HOTELIERY_TAG_NAME}" tag if increased usage area is less than minimum`, async function() {
				const addsSqMr = 199;
				const fakeByAreaFalse = { models: [{ attributes : { change_to_approved_state: `+${addsSqMr}` , approved_state:'100'} }]} ;
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeByAreaFalse);
				const result =  await isTagByUsageAddition(plan,HOTELIERY_BY_AREA_RULE_INCREASED_USAGE); 
				expect(result).to.eql(undefined);
				myStub.restore();			
			});

			it(`returns "${HOTELIERY_TAG_NAME}" tag if increased usage exceeds minimum`, async function() {
				const addsSqMr = 201;
				const fakeByAreaTrue = { models: [{ attributes : { change_to_approved_state: `+${addsSqMr}`, approved_state:'100' } }]} ;
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeByAreaTrue);
				const result =  await isTagByUsageAddition(plan,HOTELIERY_BY_AREA_RULE_INCREASED_USAGE); 
				expect(result.created_by_data_rules).to.eql(`{rule:'${HOTELIERY_BY_AREA_RULE_INCREASED_USAGE.description}',detail:'adds +${addsSqMr} ${HOTELIERY_BY_AREA_RULE_INCREASED_USAGE.usage}'}`);
				myStub.restore();			
			});		

			it(`does not return "${HOTELIERY_TAG_NAME}" tag if brand new area is less than 1`, async function() {
				const addsSqMr = 0;
				const fakeByAreaFalse = { models: [{ attributes : { change_to_approved_state: `+${addsSqMr}` , approved_state:''} }]} ;
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeByAreaFalse);
				const result =  await isTagByUsageAddition(plan,HOTELIERY_BY_AREA_RULE_NEW_USAGE); 
				expect(result).to.eql(undefined);
				myStub.restore();			
			});	
			
			it(`returns "${HOTELIERY_TAG_NAME}" tag if any brand new area added exceeds minimum`, async function() {
				const addsSqMr = 10;
				const fakeByAreaTrue = { models: [{ attributes : { change_to_approved_state: `+${addsSqMr}`, approved_state:'' } }]} ;
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeByAreaTrue);
				const result =  await isTagByUsageAddition(plan,HOTELIERY_BY_AREA_RULE_NEW_USAGE); 
				expect(result.created_by_data_rules).to.eql(`{rule:'${HOTELIERY_BY_AREA_RULE_NEW_USAGE.description}',detail:'adds +${addsSqMr} ${HOTELIERY_BY_AREA_RULE_NEW_USAGE.usage}'}`);
				myStub.restore();			
			});			
			
			it(`does not return "${HOTELIERY_TAG_NAME}" tag if percent increase is less than 30%`, async function() {
				const addsSqMr = 29;
				const fakeByAreaFalse = { models: [{ attributes : { change_to_approved_state: `+${addsSqMr}` , approved_state:'100'} }]} ;
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeByAreaFalse);
				const result =  await isTagByUsageAddition(plan,HOTELIERY_BY_AREA_RULE_PERCENT_INCREASE); 
				expect(result).to.eql(undefined);
				myStub.restore();			
			});		

			it(`returns" ${HOTELIERY_TAG_NAME}" tag if brand new area is more than 30%`, async function() {
				const addsSqMr = 31;
				const fakeByAreaTrue = { models: [{ attributes : { change_to_approved_state: `+${addsSqMr}` , approved_state:'100'} }]} ;
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeByAreaTrue);
				const result =  await isTagByUsageAddition(plan,HOTELIERY_BY_AREA_RULE_PERCENT_INCREASE); 
				expect(result.created_by_data_rules).to.eql(`{rule:'${HOTELIERY_BY_AREA_RULE_PERCENT_INCREASE.description}',detail:'adds +${addsSqMr} ${HOTELIERY_BY_AREA_RULE_PERCENT_INCREASE.usage}'}`);
				myStub.restore();			
			});				
		});		

		describe(`"${EMPLOYMENT_TAG_NAME}" tag`, function() { 
			it(`does not return  "${EMPLOYMENT_TAG_NAME}" tag if area added is less than minimum`, async function() {
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeEmploymentByAreaFalse);
				const result =  await isTagByUsageAddition(plan,EMPLOYMENT_BY_AREA_RULE_INCREASED_USAGE); 
				expect(result).to.eql(undefined);
				myStub.restore();			
			});

			it(`returns "${EMPLOYMENT_TAG_NAME}" tag if database record is found & area added exceeds minimum`, async function() {
				const addsSqMr = 2500;
				const fakeEmploymentByAreaTrue = { models: [{ attributes : { change_to_approved_state: `+${addsSqMr}` } }]} ;
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeEmploymentByAreaTrue);
				const result =  await isTagByUsageAddition(plan,EMPLOYMENT_BY_AREA_RULE_INCREASED_USAGE); 
				expect(result.created_by_data_rules).to.eql(`{rule:'${EMPLOYMENT_BY_AREA_RULE_INCREASED_USAGE.description}',detail:'adds +${addsSqMr} ${EMPLOYMENT_BY_AREA_RULE_INCREASED_USAGE.usage}'}`);
				myStub.restore();			
			});		

			it(`returns  "${EMPLOYMENT_TAG_NAME}" tag if database record is found & area added exceeds minimum as new usage `, async function() {
				const addsSqMr = 250;
				const fakeEmploymentByAreaTrue = { models: [{ attributes : { change_to_approved_state: `+${addsSqMr}`, approved_state:'' } }]} ;
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeEmploymentByAreaTrue);
				const result =  await isTagByUsageAddition(plan,EMPLOYMENT_BY_AREA_RULE_NEW_USAGE); 
				expect(result.created_by_data_rules).to.eql(`{rule:'${EMPLOYMENT_BY_AREA_RULE_NEW_USAGE.description}',detail:'adds +${addsSqMr} ${EMPLOYMENT_BY_AREA_RULE_NEW_USAGE.usage}'}`);
				myStub.restore();			
			});			
		});	
	});

	describe(`doesTagApply`, function() { 
		const CHECK_TAG_ID = 9;
		let myStub;
		let tagsResource;

		before(function() {

			const tagNameToTagId = {};
			tagNameToTagId['משהו_אקראי'] = 8;
			tagNameToTagId[housingTagName] = CHECK_TAG_ID;

			tagsResource = {
				tagNameToTagId: tagNameToTagId
			};
		});

		afterEach(async function() {
			myStub.restore();
			sinon.restore();
		});

		describe(`"${HOUSING_TAG_NAME}" tag`, function() { 
			it(`returns "${HOUSING_TAG_NAME}" tag when both housing by area and housing by units apply`, async function() {
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage');
				myStub.onCall(0).returns(fakeHousingByAreaTrue);
				myStub.onCall(1).returns(fakeHousingByUnitsTrue);
				const result =  await isHousing(planId); 
				expect(result.plan_id).to.eql(planId);
				expect(result.tag_id).to.eql(CHECK_TAG_ID);
				expect(result.created_by_data_rules).to.eql( `[{rule:'${HOUSING_BY_AREA_RULE.description}',detail:'adds +${fakeSqMrAdded} מגורים (מ"ר)'},{rule:'${HOUSING_BY_UNIT_RULE.description}',detail:'adds +${fakeUnitsAdded} מגורים (יח"ד)'}]`);
			});

			it(`returns "${HOUSING_TAG_NAME}" tag when only housing by units applies`, async function() {
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage');
				myStub.onCall(0).returns(undefined);
				myStub.onCall(1).returns(fakeHousingByUnitsTrue);
				const result =  await isHousing(planId); 
				expect(result.plan_id).to.eql(planId);
				expect(result.tag_id).to.eql(CHECK_TAG_ID);
				expect(result.created_by_data_rules).to.eql( `[{rule:'${HOUSING_BY_UNIT_RULE.description}',detail:'adds +${fakeUnitsAdded} מגורים (יח"ד)'}]`);
			});		

			it(`returns "${HOUSING_TAG_NAME}" tag when only housing by area applies`, async function() {
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage');
				myStub.onCall(0).returns(fakeHousingByAreaTrue);
				myStub.onCall(1).returns(null);
				const result =  await isHousing(planId); 
				expect(result.plan_id).to.eql(planId);
				expect(result.tag_id).to.eql(CHECK_TAG_ID);
				expect(result.created_by_data_rules).to.eql( `[{rule:'${HOUSING_BY_AREA_RULE.description}',detail:'adds +${fakeSqMrAdded} מגורים (מ"ר)'}]`);
			});

			it('returns no tags from doesTagApply when neither housing tag applies', async function() {
				myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage');
				myStub.onCall(0).returns(undefined);
				myStub.onCall(1).returns(undefined);
				const result =  await isHousing(planId); 
				expect(result).to.eql(null);
			});		
		});

		describe(`"${PUBLIC_TAG_NAME}" tag`, function() { 
		});

		describe(`"${EMPLOYMENT_TAG_NAME}" tag`, function() { 
		});
		
		describe(`"${COMMERCE_TAG_NAME}" tag`, function() { 
		});
		
		describe(`"${HOTELIERY_TAG_NAME}" tag`, function() { 
		});		

	});

});