const expect = require('chai').expect;
const { doesTagApply, TAG_NAME } = require('../../../../api/lib/tags/light_rail');

const CHECK_TAG_ID = 19;
const getPlan = (planName) => { return { id: 28, attributes: {PL_NAME: planName } };};

describe('Light rail Tag', function() {
    const tagNameToTagId = {};
    tagNameToTagId['משהו_אקראי'] = 72;
    tagNameToTagId[TAG_NAME] = CHECK_TAG_ID;

    const tagsResource = {
        tagNameToTagId: tagNameToTagId
    };


    it('Should Apply', async function() {
        const res = await doesTagApply(getPlan('רכבת קלה ברחוב קרליבך'), tagsResource);
        const dataRules = JSON.parse(res.created_by_data_rules);
        expect(dataRules.length).to.eql(1);
        expect(dataRules[0].rule).to.eql('has "רכבת קלה" in plan name');
    });

    it('Should Not Apply', async function() {
        const res = await doesTagApply(getPlan('בינוי על ציר רכבת קלה באלנבי'), tagsResource);
        expect(res).to.eql(null);
    });


});