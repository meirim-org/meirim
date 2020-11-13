const ParserIndex = require('../../../../api/lib/mavat/planInstructions/index');
const path = require('path');
const assert = require('assert');
const tagger = require('../../../../data_processing/categorize_plans');


describe('tag test tower in Netanya', function () {
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
// todo: local authority test
describe('tag test local authority', function () {
    this.timeout(15000);
    it('should not be local authority', async () => {
        const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, '../test_plan1'));
        const tags = tagger.makeTags(data);
        assert(!tags.some(tagObj => tagObj.tag === 'PublicLocalAuthorityTag'));
    });

    it('should not be local authority', async () => {
        const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, '../test_plan7'));
        const tags = tagger.makeTags(data);
        assert(!tags.some(tagObj => tagObj.tag === 'PublicLocalAuthorityTag'));
    });

    it('should be local authority', async () => {
        const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, '../test_plan4'));
        const tags = tagger.makeTags(data);
        assert(tags.some(tagObj => tagObj.tag === 'PublicLocalAuthorityTag'));
    });
});
// todo: test state owner test
describe('tag test state owner', function () {
    this.timeout(15000);
    it('should not be state owner', async () => {
        const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, '../test_plan1'));
        const tags = tagger.makeTags(data);
        assert(!tags.some(tagObj => tagObj.tag === 'PublicStateTag'));
    });

    it('should be state owner', async () => {
        const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, '../test_plan7'));
        const tags = tagger.makeTags(data);
        assert(tags.some(tagObj => tagObj.tag === 'PublicStateTag'));
    });

    it('should not be state owner', async () => {
        const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, '../test_plan4'));
        const tags = tagger.makeTags(data);
        assert(!tags.some(tagObj => tagObj.tag === 'PublicStateTag'));
    });
});
// todo: state owner entrepreneur test
describe('tag test state owner entrepreneur', function () {
    it('should not be state owner entrepreneur', async () => {
        const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, '../test_plan1'));
        const tags = tagger.makeTags(data);
        assert(!tags.some(tagObj => tagObj.tag === 'PublicStateEntrepreneurTag'));
    });

    it('should be state owner entrepreneur', async () => {
        const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, '../test_plan7'));
        const tags = tagger.makeTags(data);
        assert(tags.some(tagObj => tagObj.tag === 'PublicStateEntrepreneurTag'));
    });

    it('should not be state owner entrepreneur', async () => {
        const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, '../test_plan4'));
        const tags = tagger.makeTags(data);
        assert(!tags.some(tagObj => tagObj.tag === 'PublicStateEntrepreneurTag'));
    });
});
// todo: local authority entrepreneur test
describe('tag test local authority entrepreneur', function () {
    it('should not be local authority entrepreneur', async () => {
        const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, '../test_plan1'));
        const tags = tagger.makeTags(data);
        assert(!tags.some(tagObj => tagObj.tag === 'PublicLocalAuthorityEntrepreneurTag'));
    });

    it('should not be local authority entrepreneur', async () => {
        const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, '../test_plan7'));
        const tags = tagger.makeTags(data);
        assert(!tags.some(tagObj => tagObj.tag === 'PublicLocalAuthorityEntrepreneurTag'));
    });

    it('should be local authority entrepreneur', async () => {
        const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, '../test_plan4'));
        const tags = tagger.makeTags(data);
        assert(tags.some(tagObj => tagObj.tag === 'PublicLocalAuthorityEntrepreneurTag'));
    });
});

// todo: private land test
describe('tag test privte land', function () {
    it('should be privte land', async () => {
        const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, '../test_plan1'));
        const tags = tagger.makeTags(data);
        assert(tags.some(tagObj => tagObj.tag === 'privateEntrepreneur'));
    });

    it('should not privte land', async () => {
        const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, '../test_plan7'));
        const tags = tagger.makeTags(data);
        assert(!tags.some(tagObj => tagObj.tag === 'privateEntrepreneur'));
    });

    it('should not be privte land', async () => {
        const data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, '../test_plan4'));
        const tags = tagger.makeTags(data);
        assert(!tags.some(tagObj => tagObj.tag === 'privateEntrepreneur'));
    });
});

// todo testPlan 1: private land
// todo testPlan 4: local authority
// todo testPlan 7: state owner