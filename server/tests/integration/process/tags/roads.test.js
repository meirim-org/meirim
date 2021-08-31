const expect = require('chai').expect;
const { doesTagApply, TAG_NAME } = require('../../../../api/lib/tags/roads');
const path = require('path');
const fs = require('fs');

const CHECK_TAG_ID = 4;
const CHECK_PLAN_ID = 144;

describe('Roads Tag', function() {
    const tagNameToTagId = {};
    tagNameToTagId['משהו_אקראי'] = 13;
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


    it('Should Apply', async function() {
        const res = await doesTagApply({id: CHECK_PLAN_ID, attributes: { PL_NAME: 'דרך מס\' 44 -מחלף ניר צבי-רמלה' } }, tagsResource);
        expect(res).to.not.eql(null);
    });

    it('Should Not Apply', async function() {
        const res = await doesTagApply({id: CHECK_PLAN_ID, attributes: {PL_NAME: 'דרך השלום 14'}}, tagsResource);
        expect(res).to.eql(null);
    });


});