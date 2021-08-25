const geoms = require('../tags/ecological_bottlenecks_test_geoms');
const { doesTagApply, TAG_NAME } = require('../../../../api/lib/tags/ecological_bottlenecks/ecological_bottlenecks');
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const turf = require('turf');

const CHECK_TAG_ID = 11;

describe('Ecological Bottlenecks Tag', function() {
    let tagsResource;

    before(async function() {
        const bottlenecks = JSON.parse(fs.readFileSync(path.join(__dirname,
            '..', '..', '..', '..', 'api', 'lib', 'tags',
            'ecological_bottlenecks',
            'natural_corridors_bottlenecks_israel.geojson')))
            .features.map(entry => { return {
                geom: turf.multiPolygon(entry.geometry.coordinates),
                name: entry.properties.title
            }});

        const tagNameToTagId = {};
        tagNameToTagId['משהו_אקראי'] = 7;
        tagNameToTagId[TAG_NAME] = CHECK_TAG_ID;

        tagsResource = {
            bottlenecks: bottlenecks,
            tagNameToTagId: tagNameToTagId
        };
    });

    it('should not apply ecological bottleneck tag', async () => {
        const plan = {
            id: 7,
            attributes: {
                geom: geoms.geomPlanNotInEcologicalBottleneck
            }
        };

        const res = await doesTagApply(plan, tagsResource);
        expect(res).to.eql(null);
    });

    it('should apply ecological bottleneck tag', async () => {
       const plan = {
           id: 7,
           attributes: {
               geom: geoms.geomPlanInEcologicalBottleneck
           }
       };

       const res = await doesTagApply(plan, tagsResource);
       const dataRules = JSON.parse(res.created_by_data_rules);
       expect(dataRules.length).to.eql(1);
       expect(dataRules[0].bottleneckName).to.eql('בין משואות יצחק לניר ישראל');
       expect(dataRules[0].dunam).to.be.within(304, 305);
       expect(res.tag_id).to.eql(CHECK_TAG_ID);

    });

});