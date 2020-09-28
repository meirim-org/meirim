const ParserIndex = require('../../../../api/lib/mavat/planInstructions/index');
const path = require('path');
const assert = require('assert');
const tagger = require('../../../../data_processing/categorize_plans');


describe('tag test', function () {
    this.timeout(5000);
    const TEST_PLANS_DIR = 'tower_in_Natanya';
    let tags;

    before(async () => {
        const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR));
        tags = tagger.makeTags(data);
    });

    it('should be tower', () => {
        assert(tags.some(tagObj => tagObj.tag === 'tower'));
    });

    it('should be underground parking', () => {
        assert(tags.some(tagObj => tagObj.tag === 'undergroundParking'));
    });

});