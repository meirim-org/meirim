const expect = require('chai').expect;
const sinon = require('sinon');
const { isTagByUsageAddition } = require('../../../api/lib/tags/utils');
const { tagDataRules } = require('../../../api/constants');
const { doesTagApply: isHousing } = require('./../../../api/lib/tags/housing');
const PlanAreaChanges = require('../../../api/model/plan_area_changes');


const housingTag = 1;
const planId = 1; 
const fakeUnitsAdded = 11;
const fakeSqMrAdded = 1001;
// Housing
const fakeHousingByUnitsTrue = { models: [{ attributes : { change_to_approved_state: `+${fakeUnitsAdded}` } }]} ;
const fakeHousingByAreaTrue = { models: [{ attributes : { change_to_approved_state: `+${fakeSqMrAdded}` } }]} ;
const HOUSING_BY_UNIT_RULE = tagDataRules.filter(tag => {return tag.tagName==='דיור'})[0].rules[1];
const HOUSING_BY_AREA_RULE = tagDataRules.filter(tag => {return tag.tagName==='דיור'})[0].rules[0];
// Public Area
const fakePublicByAreaTrue = { models: [{ attributes : { change_to_approved_state: `+${fakeSqMrAdded}` } }]} ;
const PUBLIC_BY_AREA_RULE = tagDataRules.filter(tag => {return tag.tagName==='מבני ציבור'})[0].rules[0];;

describe('Tags', function() {

	describe('isTagByUsageAddition helper function - housing tag tests', function() { 
		let myStub;
		afterEach(async function() {
			myStub.restore();
			sinon.restore();
		});

		it('returns housing tag from isTagByUsageAddition for housingByUnits if database record is found & # of units exceeds minimum', async function() {
			myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeHousingByUnitsTrue);
			const result =  await isTagByUsageAddition(planId,HOUSING_BY_UNIT_RULE); 
			expect(result.created_by_data_rules).to.eql(`{rule:'${HOUSING_BY_UNIT_RULE.description}',detail:'adds +${fakeUnitsAdded} מגורים (יח"ד)'}`);
			myStub.restore();			
		});

		it('does not return housing tag from isTagByUsageAddition for housingByUnits if number of units doesn\'t meet minimum', async function() {
			const fakeUnitsAddedTooSmall = 5;
			const fakeHousingByUnitsTooSmall = { models: [{ attributes : { change_to_approved_state: `+${fakeUnitsAddedTooSmall}` } }]} ;
			myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeHousingByUnitsTooSmall);
			const result =  await isTagByUsageAddition(planId,housingTag,HOUSING_BY_UNIT_RULE); 
			expect(result).to.eql(undefined);
			myStub.restore();			
		}); 
		
		it('does not return housing tag from isTagByUsageAddition for housingByUnits if database record is not found', async function() {
			myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(null);
			const result =  await isTagByUsageAddition(planId,housingTag,HOUSING_BY_UNIT_RULE); 
			expect(result).to.eql(undefined);
			myStub.restore();			
		});		   

		it('returns housing tag from isTagByUsageAddition for housingByArea if database record is found & area added is larger than minimum', async function() {
			myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeHousingByAreaTrue);
			const result =  await isTagByUsageAddition(planId,HOUSING_BY_AREA_RULE); 
			expect(result.created_by_data_rules).to.eql(`{rule:'${HOUSING_BY_AREA_RULE.description}',detail:'adds +${fakeSqMrAdded} מגורים (מ"ר)'}`);
		});	

		it('does not return housing tag from isTagByUsageAddition for housingByArea if area added doesn\'t meet minimum', async function() {
			const fakeAreaAddedTooSmall = 500;
			const fakeHousingByAreaTooSmall = { models: [{ attributes : { change_to_approved_state: `+${fakeAreaAddedTooSmall}` } }]} ;
			myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeHousingByAreaTooSmall);
			const result =  await isTagByUsageAddition(planId,housingTag,HOUSING_BY_AREA_RULE); 
			expect(result).to.eql(undefined);
			myStub.restore();			
		}); 
		
		it('does not return housing tag from isTagByUsageAddition for housingByArea if database record is not found', async function() {
			myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(null);
			const result =  await isTagByUsageAddition(planId,housingTag,HOUSING_BY_AREA_RULE); 
			expect(result).to.eql(undefined);
			myStub.restore();			
		});		   
		
	});

	describe('isTagByUsageAddition helper function - public tag tests', function() { 
		let myStub;
		afterEach(async function() {
			myStub.restore();
			sinon.restore();
		});


		it('returns public tag from isTagByUsageAddition for public area if database record is found area added exceeds minimum', async function() {
			myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakePublicByAreaTrue);
			const result =  await isTagByUsageAddition(planId,PUBLIC_BY_AREA_RULE); 
			expect(result.created_by_data_rules).to.eql(`{rule:'${PUBLIC_BY_AREA_RULE.description}',detail:'adds +${fakeSqMrAdded} ${PUBLIC_BY_AREA_RULE.usage}'}`);
			myStub.restore();			
		});

		
	});



	describe('doesTagApply - housing tag tests', function() { 
		let myStub;
		afterEach(async function() {
			myStub.restore();
			sinon.restore();
		});

		it('returns the correct tag from doesTagApply when both housing by area and housing by units apply', async function() {
			myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage');
			myStub.onCall(0).returns(fakeHousingByAreaTrue);
			myStub.onCall(1).returns(fakeHousingByUnitsTrue);
			const result =  await isHousing(planId); 
			expect(result.length).to.eql(1);
			expect(result[0].plan_id).to.eql(planId);
			expect(result[0].tag_id).to.eql(housingTag);
			expect(result[0].created_by_data_rules).to.eql( `[{rule:'${HOUSING_BY_AREA_RULE.description}',detail:'adds +${fakeSqMrAdded} מגורים (מ"ר)'},{rule:'${HOUSING_BY_UNIT_RULE.description}',detail:'adds +${fakeUnitsAdded} מגורים (יח"ד)'}]`);
		});

		it('returns the correct tag from doesTagApply when only housing by units applies', async function() {
			myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage');
			myStub.onCall(0).returns(undefined);
			myStub.onCall(1).returns(fakeHousingByUnitsTrue);
			const result =  await isHousing(planId); 
			expect(result.length).to.eql(1);
			expect(result[0].plan_id).to.eql(planId);
			expect(result[0].tag_id).to.eql(housingTag);
			expect(result[0].created_by_data_rules).to.eql( `[{rule:'${HOUSING_BY_UNIT_RULE.description}',detail:'adds +${fakeUnitsAdded} מגורים (יח"ד)'}]`);
		});		

		it('returns the correct tag from doesTagApply when only housing by area applies', async function() {
			myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage');
			myStub.onCall(0).returns(fakeHousingByAreaTrue);
			myStub.onCall(1).returns(null);
			const result =  await isHousing(planId); 
			expect(result.length).to.eql(1);
			expect(result[0].plan_id).to.eql(planId);
			expect(result[0].tag_id).to.eql(housingTag);
			expect(result[0].created_by_data_rules).to.eql( `[{rule:'${HOUSING_BY_AREA_RULE.description}',detail:'adds +${fakeSqMrAdded} מגורים (מ"ר)'}]`);
		});

		it('returns no tags from doesTagApply when neither housing tag applies', async function() {
			myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage');
			myStub.onCall(0).returns(undefined);
			myStub.onCall(1).returns(undefined);
			const result =  await isHousing(planId); 
			expect(result.length).to.eql(0);
		});		

	});

});