const ParserIndex = require('../../../../api/lib/mavat/planInstructions/index');
const path = require('path');
const assert = require('assert');
const tagger = require('../../../../data_processing/categorize_plans');

describe('tower tag test', function () {
    this.timeout(20000);

    it('should be tower',async () => {
        const TEST_PLANS_DIR = 'tower_with_par';
        const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR));
        const tags = tagger.makeTags(data);
        let thereIsTower = false;
        for(let i = 0 ; i < tags.length && !thereIsTower; i++) {
            if(tags[i].tag === 'tower') {
                thereIsTower = true;
            }
        }
        assert.strictEqual(thereIsTower,true);
    })
});