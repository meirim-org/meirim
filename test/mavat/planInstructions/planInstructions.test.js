const ParserIndex = require('../../../api/lib/mavat/planInstructions/index');
const path = require('path');
const assert = require('assert');


describe('Taba1 parsing test', () => {
    let data;
    const TEST_PLANS_DIR = 'test_plan1';

    before(async () =>
        data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR)));

    it('data should not be undefined', async () =>
        assert.notStrictEqual(data, undefined));

    it('explanation', () =>
        assert.strictEqual(data.planExplenation, 'תכנית זו מוסיפה אחוזי בנייה כללים למגרש מספר 17המאשר לפי תכנית תמ"ל1008 בחלקה מספר 216 גוש \n' +
            '16607 באדמות טורעאן.\n' +
            'התכנית מוספה שטח אחוזי בנייה כללים, מאחר ושטח המגרש הוא גדול בהרבה יחסית לממוצע המגרשים \n' +
            'באותה תכנית, המאפשר שמירה על תכנית הבנוי של התכנית תמ"ל1008, חניון פיתוח וכו\'.'));

    it('should have only one row on table 5', () =>
        assert.strictEqual(data.chartFive.length, 1));

    describe('table 5 single row parsing test', () => {
        let tbl5_first_row;

        before(() =>
            tbl5_first_row = data.chartFive[0]);

        it('designation', () =>
            assert.strictEqual(tbl5_first_row.designation, "מגורים א'"));

        it('use', () =>
            assert.strictEqual(tbl5_first_row.use, "מגורים א'"));

        //TODO: translate taei shetah, maybe it's the "areaNumber" attribute?
        it('taei shetah', () =>
            assert.strictEqual(tbl5_first_row.areaNumber, '100'));

        //TODO: maybe there are no spaces near the '-' in the string, if this tests fails, check that.
        it('location', () =>
            assert.strictEqual(tbl5_first_row.location, 'רכס טורעאן - תמ"ל 1008'));

        it('field size sqm test', () =>
            assert.strictEqual(tbl5_first_row.fieldSizeSqm, '775'));

        it('size sqm above primary entrance', () =>
            assert.strictEqual(tbl5_first_row.abovePrimaryMain, '570'));

        it('size sqm above service entrance', () =>
            assert.strictEqual(tbl5_first_row.abovePrimaryService, '150'));

        it('size sqm below primary entrance', () =>
            assert.strictEqual(tbl5_first_row.belowPrimaryMain, '180'));

        it('size sqm below service entrance', () =>
            assert.strictEqual(tbl5_first_row.belowPrimaryService, '50'));

        it('overall building lands (sah hakol shithey bniya)', () =>
            assert.strictEqual(tbl5_first_row.overallBuildingLand, '950'));

        it('overall building area sqm (tahsit)', () =>
            assert.strictEqual(tbl5_first_row.tahsit, '122.58'));

        it('number of housing units', () =>
            assert.strictEqual(tbl5_first_row.numOfHousingUnits, '3'));

        it('height of building meters', () =>
            assert.strictEqual(tbl5_first_row.heightAboveEntrance, '12'));

        it('floors above entrance', () =>
            assert.strictEqual(tbl5_first_row.floorsAbove, '3'));

        it('floors below entrance', () =>
            assert.strictEqual(tbl5_first_row.floorsBelow, '1'));

        it('building right side line', () =>
            assert.strictEqual(tbl5_first_row.sideLineRight, '3'));

        it('building left side line', () =>
            assert.strictEqual(tbl5_first_row.sideLineLeft, '3'));

        it('building back side line', () =>
            assert.strictEqual(tbl5_first_row.sideLineBack, '5'));

        it('building front side line', () =>
            assert.strictEqual(tbl5_first_row.sideLineFront, '5'));

    });
});

describe('Taba2 parsing test', () => {
    let data;
    const TEST_PLANS_DIR = 'test_plan2';

    before(async () =>
        data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR)));

    it('data should not be undefined', async () =>
        assert.notStrictEqual(data, undefined));

    it('explanation', () => {
        assert.strictEqual(data.planExplenation.includes('מטרת התכנית הינה הגדרת שימושים בקרקע חקלאית בחלקות ב\' במושב ארבל'), true);
        assert.strictEqual(data.planExplenation.includes('מיוחדות המבוקש בתכנית.'), true);
    });

    it('should have 3 rows on table 5', () =>
        assert.strictEqual(data.chartFive.length, 3));

    describe('table 5 last row parsing test', () => {
        let tbl5_third_row;

        before(() => {
            tbl5_third_row = data.chartFive[2];
        });

        it('designation', () =>
            assert.strictEqual(tbl5_third_row.designation, "קרקע חקלאית"));

        it('use', () =>
            assert.strictEqual(tbl5_third_row.use, "מבני תפעול תחזוקה ובקרה"));

        //TODO: translate taei shetah, maybe it's the "areaNumber" attribute?
        it('taei shetah', () =>
            assert.strictEqual(tbl5_third_row.taeiShetah, '101'));

        it('location', () =>
            assert.strictEqual(tbl5_third_row.location === undefined || tbl5_third_row.location === '', true));

        it('field size sqm test', () =>
            assert.strictEqual(tbl5_third_row.fieldSizeSqm, '51453.23'));

        it('size sqm above primary entrance', () =>
            assert.strictEqual(tbl5_third_row.abovePrimaryMain, '705'));

        it('size sqm above service entrance', () =>
            assert.strictEqual(tbl5_third_row.abovePrimaryService, '12'));

        it('size sqm below primary entrance', () =>
            assert.strictEqual(tbl5_third_row.belowPrimaryMain, ''));

        it('size sqm below service entrance', () =>
            assert.strictEqual(tbl5_third_row.belowPrimaryMainService, ''));

        it('overall building land (sah hakol shithey bniya)', () =>
            assert.strictEqual(tbl5_third_row.overallBuildingLand, '717'));

        it('overall building area sqm (tahsit)', () =>
            assert.strictEqual(tbl5_third_row.tahsit, '35.64'));

        it('number of housing units', () =>
            assert.strictEqual(tbl5_third_row.numOfHousingUnits, ''));

        it('height of building meters', () =>
            assert.strictEqual(tbl5_third_row.heightAboveEntrance, '6'));

        it('floors above entrance', () =>
            assert.strictEqual(tbl5_third_row.floorsAbove, '1'));

        it('floors below entrance', () =>
            assert.strictEqual(tbl5_third_row.floorsBelow === undefined || tbl5_third_row.floorstBelow ==='',
                true));

        it('building right side line', () =>
            assert.strictEqual(tbl5_third_row.sideLineRight, '3'));

        it('building left side line', () =>
            assert.strictEqual(tbl5_third_row.sideLineLeft, '3'));

        it('building back side line', () =>
            assert.strictEqual(tbl5_third_row.sideLineBack, '3'));

        it('building front side line', () =>
            assert.strictEqual(tbl5_third_row.sideLineFront, '5'));

    });
});