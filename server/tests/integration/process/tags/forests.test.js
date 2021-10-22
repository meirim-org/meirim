const expect = require('chai').expect;
const { doesTagApply, TAG_NAME } = require('../../../../api/lib/tags/forests');
const PlanChartFourRow = require('../../../../api/model/plan_chart_four_row');
const sinon = require('sinon');

const CHECK_TAG_ID = 71;
const plan = {id: 23};

describe('Forest Tag', function() {
    let getFatherCategoriesStub;
    const tagNameToTagId = {};
    tagNameToTagId['משהו_אקראי'] = 31;
    tagNameToTagId[TAG_NAME] = CHECK_TAG_ID;

    const tagsResource = {
        tagNameToTagId: tagNameToTagId
    };

    afterEach(async function() {
        getFatherCategoriesStub.restore();
        sinon.restore();
    });


    it('Should Apply', async function() {
        const fakeFatherCategories = { models: [
                { attributes : { id: 2, father_category: 'מגורים' } },
                { attributes: { id: 3, father_category: 'יער' } },
                { attributes: { id: 4, father_category: 'משהו אקראי לגמרי'} }
            ]};

        getFatherCategoriesStub = sinon.stub(PlanChartFourRow, 'getFatherCategoriesOfPlan').returns(fakeFatherCategories);
        const res = await doesTagApply(plan, tagsResource);
        const dataRules = JSON.parse(res.created_by_data_rules);
        expect(dataRules.length).to.eql(1);
        expect(dataRules[0].rule).to.eql('has "יער" in a father category in chart 4');

        getFatherCategoriesStub.restore();
    });

    it('Should Not Apply', async function() {
        const fakeFatherCategories = { models: [
                { attributes : { id: 2, father_category: 'מגורים' } },
                { attributes: { id: 3, father_category: 'מגורים מיוחדים' } },
                { attributes: { id: 4, father_category: 'משהו אקראי לגמרי'} }
            ]};

        getFatherCategoriesStub = sinon.stub(PlanChartFourRow, 'getFatherCategoriesOfPlan').returns(fakeFatherCategories);
        const res = await doesTagApply(plan, tagsResource);
        expect(res).to.eql(null);

        getFatherCategoriesStub.restore();
    });


});