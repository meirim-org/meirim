const expect = require('chai').expect;
const sinon = require('sinon');
const { generateTagsForPlan } = require('../../../api/lib/tags');
const { isTagByUsageAddition } = require('../../../api/lib/tags/utils');
const { tags, tagDataRules } = require('../../../api/constants');
const { isHousing } = require('./../../../api/lib/tags/housing');
const PlanAreaChanges = require('../../../api/model/plan_area_changes');


const housingTag = tags.filter(res=>res.tagName == 'דיור').map(ele=>ele.tagId)[0];
const planId = 1; 
const fakeUnitsAdded = 11;
const fakeSqMrAdded = 1001;
const fakeHousingByUnitsTrue = { models: [{ attributes : { change_to_approved_state: `+${fakeUnitsAdded}` } }]} ;
const fakeHousingByAreaTrue = { models: [{ attributes : { change_to_approved_state: `+${fakeSqMrAdded}` } }]} ;
const HOUSING_BY_UNIT = 'housingByUnits';
const HOUSING_BY_AREA = 'housingByArea'

describe('Tags', function() {

    describe('isTagByUsageAddition helper function - housing tag tests', function() { 
        let myStub;
        afterEach(async function() {
            myStub.restore();
            sinon.restore();
        });


        it('returns housing tag from isTagByUsageAddition for housingByUnits if database record is found & # of units exceeds minimum', async function() {
            myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeHousingByUnitsTrue);
            const result =  await isTagByUsageAddition(planId,housingTag,HOUSING_BY_UNIT); 
            expect(result.tag_id).to.eql('1');
            expect(result.created_by_data_rules).to.eql(`{rule:'${tagDataRules[HOUSING_BY_UNIT].description}',detail:'adds +${fakeUnitsAdded} מגורים (יח"ד)'}`);
            myStub.restore();            
        });

        it('does not return housing tag from isTagByUsageAddition for housingByUnits if number of units doesn\'t meet minimum', async function() {
            const fakeUnitsAddedTooSmall = 5;
            const fakeHousingByUnitsTooSmall = { models: [{ attributes : { change_to_approved_state: `+${fakeUnitsAddedTooSmall}` } }]} ;
            myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeHousingByUnitsTooSmall);
            const result =  await isTagByUsageAddition(planId,housingTag,HOUSING_BY_UNIT); 
            expect(result).to.eql(undefined);
            myStub.restore();            
        }); 
        
        it('does not return housing tag from isTagByUsageAddition for housingByUnits if database record is not found', async function() {
            myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(null);
            const result =  await isTagByUsageAddition(planId,housingTag,HOUSING_BY_UNIT); 
            expect(result).to.eql(undefined);
            myStub.restore();            
        });           

        it('returns housing tag from isTagByUsageAddition for housingByArea if database record is found & area added is larger than minimum', async function() {
            myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeHousingByAreaTrue);
            const result =  await isTagByUsageAddition(planId,housingTag,HOUSING_BY_AREA); 
            expect(result.tag_id).to.eql('1');
            expect(result.created_by_data_rules).to.eql(`{rule:'${tagDataRules[HOUSING_BY_AREA].description}',detail:'adds +${fakeSqMrAdded} מגורים (מ"ר)'}`);
        });    

        it('does not return housing tag from isTagByUsageAddition for housingByArea if area added doesn\'t meet minimum', async function() {
            const fakeAreaAddedTooSmall = 500;
            const fakeHousingByAreaTooSmall = { models: [{ attributes : { change_to_approved_state: `+${fakeAreaAddedTooSmall}` } }]} ;
            myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeHousingByAreaTooSmall);
            const result =  await isTagByUsageAddition(planId,housingTag,HOUSING_BY_AREA); 
            expect(result).to.eql(undefined);
            myStub.restore();            
        }); 
        
        it('does not return housing tag from isTagByUsageAddition for housingByArea if database record is not found', async function() {
            myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(null);
            const result =  await isTagByUsageAddition(planId,housingTag,HOUSING_BY_AREA); 
            expect(result).to.eql(undefined);
            myStub.restore();            
        });           
        
    });


    describe('isHousing - housing tag tests', function() { 
        let myStub;
        afterEach(async function() {
            myStub.restore();
            sinon.restore();
        });

        it('returns the correct tag from generateTagsForPlan when both housing by area and housing by units apply', async function() {
            myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage');
            myStub.onCall(0).returns(fakeHousingByAreaTrue);
            myStub.onCall(1).returns(fakeHousingByUnitsTrue);
            const result =  await isHousing(planId); 
            expect(result.length).to.eql(1);
            expect(result[0].plan_id).to.eql(planId);
            expect(result[0].tag_id).to.eql( tags['דיור']);
            expect(result[0].created_by_data_rules).to.eql( `[{rule:'${tagDataRules[HOUSING_BY_AREA].description}',detail:'adds +${fakeSqMrAdded} מגורים (מ"ר)'},{rule:'${tagDataRules[HOUSING_BY_UNIT].description}',detail:'adds +${fakeUnitsAdded} מגורים (יח"ד)'}]`);
        });

        it('returns the correct tag from generateTagsForPlan when only housing by units applies', async function() {
            myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage');
            myStub.onCall(0).returns(undefined);
            myStub.onCall(1).returns(fakeHousingByUnitsTrue);
            const result =  await isHousing(planId); 
            expect(result.length).to.eql(1);
            expect(result[0].plan_id).to.eql(planId);
            expect(result[0].tag_id).to.eql( tags['דיור']);
            expect(result[0].created_by_data_rules).to.eql( `[{rule:'${tagDataRules[HOUSING_BY_UNIT].description}',detail:'adds +${fakeUnitsAdded} מגורים (יח"ד)'}]`);
        });        

        it('returns the correct tag from generateTagsForPlan when only housing by area applies', async function() {
            myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage');
            myStub.onCall(0).returns(fakeHousingByAreaTrue);
            myStub.onCall(1).returns(null);
            const result =  await isHousing(planId); 
            expect(result.length).to.eql(1);
            expect(result[0].plan_id).to.eql(planId);
            expect(result[0].tag_id).to.eql( tags['דיור']);
            expect(result[0].created_by_data_rules).to.eql( `[{rule:'${tagDataRules[HOUSING_BY_AREA].description}',detail:'adds +${fakeSqMrAdded} מגורים (מ"ר)'}]`);
        });

        it('returns no tags from generateTagsForPlan when neither housing tag applies', async function() {
            myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage');
            myStub.onCall(0).returns(undefined);
            myStub.onCall(1).returns(undefined);
            const result =  await isHousing(planId); 
            expect(result.length).to.eql(0);
        });        

    });

});