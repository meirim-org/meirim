const expect = require('chai').expect;
const { doesTagApply, TAG_NAME } = require('../../../../api/lib/tags/heavy_rail');
const PlanAreaChanges = require('../../../../api/model/plan_area_changes');
const sinon = require('sinon');
const path = require('path');
const fs = require('fs');

const CHECK_TAG_ID = 97;
const CHECK_PLAN_ID = 14;

describe('Heavy Rail Tag', function() {
    let isAddingUsageStub;
    const tagNameToTagId = {};
    tagNameToTagId['משהו_אקראי'] = 72;
    tagNameToTagId[TAG_NAME] = CHECK_TAG_ID;

    let streetNames;
    try {
        streetNames = fs.readFileSync(path.join(__dirname, '..', '..', '..', '..', 'api', 'lib', 'tags', 'street_names.csv'), 'utf8');
        streetNames = streetNames.split('\n');
        // remove the header
        streetNames = new Set(streetNames.slice(1));

    } catch (err) {
        console.log('ERROR!!! CANNOT LOAD FILE');
        streetNames = new Set();
    }

    const tagsResource = {
        tagNameToTagId: tagNameToTagId,
        streetNames: streetNames

    };

    afterEach(async function() {
        isAddingUsageStub.restore();
        sinon.restore();
    });


    it('Should Apply', async function() {
        isAddingUsageStub = sinon.stub(PlanAreaChanges, 'isAdditionInUsage').returns(false);
        const res = await doesTagApply({id: CHECK_PLAN_ID, attributes: {PL_NAME: 'מסילת גורל'}}, tagsResource);
        expect(res).to.not.eql(null);

        isAddingUsageStub.restore();
    });

    it('Should Not Apply', async function() {
        isAddingUsageStub = sinon.stub(PlanAreaChanges, 'isAdditionInUsage').returns(false);
        const res = await doesTagApply({id: CHECK_PLAN_ID, attributes: {PL_NAME: 'מסילת ישרים 47'}}, tagsResource);
        expect(res).to.eql(null);

        isAddingUsageStub.restore();
    });


});