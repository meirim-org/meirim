const expect = require('chai').expect;
const sinon = require('sinon');
const { Bookshelf, Knex} = require('../../../api/service/database');
const { generateTagsForPlan, isTag } = require('../../../api/lib/tags');
const { tags, tagDataRules } = require('../../../api/constants');
const PlanAreaChanges = require('../../../api/model/plan_area_changes');


const housingTag = tags['דיור'];


const planId = 1; 
const fakeUnitsAdded = 11;
const fakeSqMrAdded = 1001;
const fakeHousingByUnitsTrue = { models: [{ attributes : { change_to_approved_state: `+${fakeUnitsAdded}` } }]} ;
const fakeHousingByAreaTrue = { models: [{ attributes : { change_to_approved_state: `+${fakeSqMrAdded}` } }]} ;
const HOUSING_BY_UNIT = 'housingByUnits';
const HOUSING_BY_AREA = 'housingByArea'






describe('lib\tags', function() {


 
    describe('isTag helper function - housing tag tests', function() { 
        let myStub;
        afterEach(async function() {
            myStub.restore();
            sinon.restore();
        });


        it('returns housing tag from isTag for housingByUnits if database record is found & # of units exceeds minimum', async function() {
            myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeHousingByUnitsTrue);
            const result =  await isTag(planId,housingTag,HOUSING_BY_UNIT); 
            expect(result.tag_id).to.eql('1');
            expect(result.created_by_data_rules).to.eql(`{rule:'${tagDataRules[HOUSING_BY_UNIT].description}',detail:'adds +${fakeUnitsAdded} מגורים (יח"ד)'}`);
            myStub.restore();            
        });

        it('does not return housing tag from isTag for housingByUnits if number of units doesn\'t meet minimum', async function() {
            const fakeUnitsAddedTooSmall = 5;
            const fakeHousingByUnitsTooSmall = { models: [{ attributes : { change_to_approved_state: `+${fakeUnitsAddedTooSmall}` } }]} ;
            myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeHousingByUnitsTooSmall);
            const result =  await isTag(planId,housingTag,HOUSING_BY_UNIT); 
            expect(result).to.eql(undefined);
            myStub.restore();            
        }); 
        
        it('does not return housing tag from isTag for housingByUnits if database record is not found', async function() {
            myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(null);
            const result =  await isTag(planId,housingTag,HOUSING_BY_UNIT); 
            expect(result).to.eql(undefined);
            myStub.restore();            
        });           

        it('returns housing tag from isTag for housingByArea if database record is found & area added is larger than minimum', async function() {
            myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeHousingByAreaTrue);
            const result =  await isTag(planId,housingTag,HOUSING_BY_AREA); 
            expect(result.tag_id).to.eql('1');
            expect(result.created_by_data_rules).to.eql(`{rule:'${tagDataRules[HOUSING_BY_AREA].description}',detail:'adds +${fakeSqMrAdded} מגורים (מ"ר)'}`);
        });    

        it('does not return housing tag from isTag for housingByArea if area added doesn\'t meet minimum', async function() {
            const fakeAreaAddedTooSmall = 500;
            const fakeHousingByAreaTooSmall = { models: [{ attributes : { change_to_approved_state: `+${fakeAreaAddedTooSmall}` } }]} ;
            myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(fakeHousingByAreaTooSmall);
            const result =  await isTag(planId,housingTag,HOUSING_BY_AREA); 
            expect(result).to.eql(undefined);
            myStub.restore();            
        }); 
        
        it('does not return housing tag from isTag for housingByArea if database record is not found', async function() {
            myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage').returns(null);
            const result =  await isTag(planId,housingTag,HOUSING_BY_AREA); 
            expect(result).to.eql(undefined);
            myStub.restore();            
        });           
        
    });


    describe('generateTagsForPlan - housing tag tests', function() { 
        let myStub;
        afterEach(async function() {
            myStub.restore();
            sinon.restore();
        });



        it('returns the correct tag from generateTagsForPlan when both housing by area and housing by units apply', async function() {
            myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage');
            myStub.onCall(0).returns(fakeHousingByAreaTrue);
            myStub.onCall(1).returns(fakeHousingByUnitsTrue);
            const result =  await generateTagsForPlan(planId); 
            expect(result.length).to.eql(1);
            expect(result[0].plan_id).to.eql(planId);
            expect(result[0].tag_id).to.eql( tags['דיור']);
            expect(result[0].created_by_data_rules).to.eql( `[{rule:'${tagDataRules[HOUSING_BY_AREA].description}',detail:'adds +${fakeSqMrAdded} מגורים (מ"ר)'},{rule:'${tagDataRules[HOUSING_BY_UNIT].description}',detail:'adds +${fakeUnitsAdded} מגורים (יח"ד)'}]`);
        });

        it('returns the correct tag from generateTagsForPlan when only housing by units applies', async function() {
            myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage');
            myStub.onCall(0).returns(undefined);
            myStub.onCall(1).returns(fakeHousingByUnitsTrue);
            const result =  await generateTagsForPlan(planId); 
            expect(result.length).to.eql(1);
            expect(result[0].plan_id).to.eql(planId);
            expect(result[0].tag_id).to.eql( tags['דיור']);
            expect(result[0].created_by_data_rules).to.eql( `[{rule:'${tagDataRules[HOUSING_BY_UNIT].description}',detail:'adds +${fakeUnitsAdded} מגורים (יח"ד)'}]`);
        });        

        it('returns the correct tag from generateTagsForPlan when only housing by area applies', async function() {
            myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage');
            myStub.onCall(0).returns(fakeHousingByAreaTrue);
            myStub.onCall(1).returns(null);
            const result =  await generateTagsForPlan(planId); 
            expect(result.length).to.eql(1);
            expect(result[0].plan_id).to.eql(planId);
            expect(result[0].tag_id).to.eql( tags['דיור']);
            expect(result[0].created_by_data_rules).to.eql( `[{rule:'${tagDataRules[HOUSING_BY_AREA].description}',detail:'adds +${fakeSqMrAdded} מגורים (מ"ר)'}]`);
        });

        it('returns no tags from generateTagsForPlan when neither housing tag applies', async function() {
            myStub = sinon.stub(PlanAreaChanges,'byPlanAndUsage');
            myStub.onCall(0).returns(undefined);
            myStub.onCall(1).returns(undefined);
            const result =  await generateTagsForPlan(planId); 
            expect(result.length).to.eql(0);
        });        

    });

});