const expect = require('chai').expect;
const { doesTagApply, TAG_NAME } = require('../../../../api/lib/tags/rivers');
const PlanChartFourRow = require('../../../../api/model/plan_chart_four_row');
const sinon = require('sinon');

const CHECK_TAG_ID = 3;
const plan = {id: 97};

describe('River Tag', function() {
    let getFatherCategoriesStub;
    const tagNameToTagId = {};
    tagNameToTagId['משהו_אקראי'] = 5;
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
                { attributes: { id: 3, father_category: 'נחל' } },
                { attributes: { id: 4, father_category: 'משהו אקראי לגמרי'} }
        ]};

        getFatherCategoriesStub = sinon.stub(PlanChartFourRow, 'getFatherCategoriesOfPlan').returns(fakeFatherCategories);
        const res = await doesTagApply(plan, tagsResource);
        const dataRules = JSON.parse(res.created_by_data_rules);
        expect(dataRules.length).to.eql(1);
        expect(dataRules[0].rule).to.eql('has "נחל" in a father category in chart 4');

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