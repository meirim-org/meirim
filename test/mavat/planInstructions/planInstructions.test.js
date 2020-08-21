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
        assert.strictEqual(data.planExplanation, 'תכנית זו מוסיפה אחוזי בנייה כללים למגרש מספר 17המאשר לפי תכנית תמ"ל1008 בחלקה מספר 216 גוש \n' +
            '16607 באדמות טורעאן.\n' +
            'התכנית מוספה שטח אחוזי בנייה כללים, מאחר ושטח המגרש הוא גדול בהרבה יחסית לממוצע המגרשים \n' +
            'באותה תכנית, המאפשר שמירה על תכנית הבנוי של התכנית תמ"ל1008, חניון פיתוח וכו\'.'));

    it('should have only one row on table 5', () =>
        assert.strictEqual(data.chartFive.length, 1));

    it('should have only one row on table 1.8.1', () =>
        assert.strictEqual(data.charts18.chart181.length, 1));

    //table 1.8.2 parses wrong in this pdf

    describe('tables 1.8 parsing test', () => {

        describe('table 1.8.1 parsing test', () => {
            let tbl181FirstRow;

            before(() => {
               tbl181FirstRow = data.charts18.chart181[0];
            });

            it('profession', () => {
                assert.strictEqual(tbl181FirstRow.profession, '');
            });

            it('type', () => {
                assert.strictEqual(tbl181FirstRow.type, 'פרטי');
            });

            it('name', () => {
                assert.strictEqual(tbl181FirstRow.name, 'עמאר נסאר');
            });

            it('license number', () => {
                assert.strictEqual(tbl181FirstRow.license_number, '');
            });

            it('corporate', () => {
                assert.strictEqual(tbl181FirstRow.corporate, '');
            });

            it('city', () => {
                assert.strictEqual(tbl181FirstRow.city, 'טורעאן');
            });

            it('street', () => {
                assert.strictEqual(tbl181FirstRow.street, `דרב אלברג' )1 (`);
            });

            it('house', () => {
                assert.strictEqual(tbl181FirstRow.house, '');
            });

            it('phone', () => {
                assert.strictEqual(tbl181FirstRow.phone, '04-6412926');
            });

            it('fax', () => {
                assert.strictEqual(tbl181FirstRow.fax, '04-6412926');
            });

            it('email', () => {
                assert.strictEqual(tbl181FirstRow.email, 'adel.dahly@gmail.com');
            });

        });


    });

    describe('table 5 single row parsing test', () => {
        let tbl5FirstRow;

        before(() =>
            tbl5FirstRow = data.chartFive[0]);

        it('designation', () =>
            assert.strictEqual(tbl5FirstRow.designation, "מגורים א'"));

        it('use', () =>
            assert.strictEqual(tbl5FirstRow.use, "מגורים א'"));

        it('taei shetah', () =>
            assert.strictEqual(tbl5FirstRow.area_number, '100'));

        it('location', () =>
            assert.strictEqual(tbl5FirstRow.location, 'רכס טורעאן - תמ"ל 1008'));

        it('field size sqm test', () =>
            assert.strictEqual(tbl5FirstRow.field_size_sqm, '775'));

        it('size sqm above primary entrance', () =>
            assert.strictEqual(tbl5FirstRow.above_primary_main, '570'));

        it('size sqm above service entrance', () =>
            assert.strictEqual(tbl5FirstRow.above_primary_service, '150'));

        it('size sqm below primary entrance', () =>
            assert.strictEqual(tbl5FirstRow.below_primary_main, '180'));

        it('size sqm below service entrance', () =>
            assert.strictEqual(tbl5FirstRow.below_primary_service, '50'));

        it('overall building lands (sah hakol shithey bniya)', () =>
            assert.strictEqual(tbl5FirstRow.overall_building_land, '950'));

        it('building percentage', () =>
            assert.strictEqual(tbl5FirstRow.building_percentage, '122.58'));

        it('tahsit', () =>
            assert.strictEqual(tbl5FirstRow.tahsit === '' || tbl5FirstRow.tahsit === undefined,
                true));

        it('density yahad to dunam', () =>
            assert.strictEqual(tbl5FirstRow.density_yahad_to_dunam === '' || tbl5FirstRow.densityYahadToDunam === undefined,
                true));

        it('number of housing units', () =>
            assert.strictEqual(tbl5FirstRow.num_of_housing_units, '3'));

        it('height of building meters', () =>
            assert.strictEqual(tbl5FirstRow.height_above_entrance, '12'));

        it('floors above entrance', () =>
            assert.strictEqual(tbl5FirstRow.floors_above, '3'));

        it('floors below entrance', () =>
            assert.strictEqual(tbl5FirstRow.floors_below, '1'));

        it('building right side line', () =>
            assert.strictEqual(tbl5FirstRow.side_line_right, '3'));

        it('building left side line', () =>
            assert.strictEqual(tbl5FirstRow.side_line_left, '3'));

        it('building back side line', () =>
            assert.strictEqual(tbl5FirstRow.side_line_back, '5'));

        it('building front side line', () =>
            assert.strictEqual(tbl5FirstRow.side_line_front, '5'));

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
        assert.strictEqual(data.planExplanation.includes('מטרת התכנית הינה הגדרת שימושים בקרקע חקלאית בחלקות ב\' במושב ארבל'), true);
        assert.strictEqual(data.planExplanation.includes('מיוחדות המבוקש בתכנית.'), true);
    });

    it('should have 3 rows on table 5', () =>
        assert.strictEqual(data.chartFive.length, 3));

    it('should have only one row on table 1.8.1', () =>
        assert.strictEqual(data.charts18.chart181.length, 1));

    it('should have only one row on table 1.8.2', () =>
        assert.strictEqual(data.charts18.chart182.length, 1));

    it('should have only no rows on table 1.8.3', () =>
        assert.strictEqual(data.charts18.chart183.length, 0));

    describe('tables 1.8 parsing test', () => {

        describe('table 1.8.1 parsing test', () => {
            let tbl181FirstRow;

            before(() => {
                tbl181FirstRow = data.charts18.chart181[0];
            });

            it('profession', () => {
                assert.strictEqual(tbl181FirstRow.profession, '');
            });

            it('type', () => {
                assert.strictEqual(tbl181FirstRow.type, 'אחר');
            });

            it('name', () => {
                assert.strictEqual(tbl181FirstRow.name, '');
            });

            it('license number', () => {
                assert.strictEqual(tbl181FirstRow.license_number, '');
            });

            it('corporate', () => {
                assert.strictEqual(tbl181FirstRow.corporate, 'אגש"ח מושב ארבל');
            });

            it('city', () => {
                assert.strictEqual(tbl181FirstRow.city, 'ארבל');
            });

            it('street', () => {
                assert.strictEqual(tbl181FirstRow.street, `ארבל`);
            });

            it('house', () => {
                assert.strictEqual(tbl181FirstRow.house, '');
            });

            it('phone', () => {
                assert.strictEqual(tbl181FirstRow.phone, '04-6732606');
            });

            it('fax', () => {
                assert.strictEqual(tbl181FirstRow.fax, '04-6734541');
            });

            it('email', () => {
                assert.strictEqual(tbl181FirstRow.email, 'aharony@iec.co.il');
            });

        });

        describe('table 1.8.2 parsing test', () => {
            let tbl182FirstRow;

            before(() => {
                tbl182FirstRow = data.charts18.chart182[0];
            });

            it('type', () => {
                assert.strictEqual(tbl182FirstRow.type, 'פרטי');
            });

            it('name', () => {
                assert.strictEqual(tbl182FirstRow.name, 'אלי יצחק');
            });

            it('license number', () => {
                assert.strictEqual(tbl182FirstRow.license_number, '');
            });

            it('corporate', () => {
                assert.strictEqual(tbl182FirstRow.corporate, '');
            });

            it('city', () => {
                assert.strictEqual(tbl182FirstRow.city, 'ארבל');
            });

            it('street', () => {
                assert.strictEqual(tbl182FirstRow.street, `ארבל`);
            });

            it('house', () => {
                assert.strictEqual(tbl182FirstRow.house, '');
            });

            it('phone', () => {
                assert.strictEqual(tbl182FirstRow.phone, '04-6733324');
            });

            it('fax', () => {
                assert.strictEqual(tbl182FirstRow.fax, '');
            });

            it('email', () => {
                assert.strictEqual(tbl182FirstRow.email, 'Mtrack@012.net.il');
            });

        });
    });

    describe('table 5 last row parsing test', () => {
        let tbl5ThirdRow;

        before(() => {
            tbl5ThirdRow = data.chartFive[2];
        });

        it('designation', () =>
            assert.strictEqual(tbl5ThirdRow.designation, "קרקע חקלאית"));

        it('use', () =>
            assert.strictEqual(tbl5ThirdRow.use, "מבני תפעול תחזוקה ובקרה"));

        it('taei shetah', () =>
            assert.strictEqual(tbl5ThirdRow.area_number, '101'));

        it('location', () =>
            assert.strictEqual(tbl5ThirdRow.location, ''));

        it('field size sqm test', () =>
            assert.strictEqual(tbl5ThirdRow.field_size_sqm, '51453.23'));

        it('size sqm above primary entrance', () =>
            assert.strictEqual(tbl5ThirdRow.above_primary_main, '705'));

        it('size sqm above service entrance', () =>
            assert.strictEqual(tbl5ThirdRow.above_primary_service, '12'));

        it('size sqm below primary entrance', () =>
            assert.strictEqual(tbl5ThirdRow.below_primary_main, ''));

        it('size sqm below service entrance', () =>
            assert.strictEqual(tbl5ThirdRow.below_primary_service, ''));

        it('overall building land (sah hakol shithey bniya)', () =>
            assert.strictEqual(tbl5ThirdRow.overall_building_land, '717'));

        it('building percentage', () =>
            assert.strictEqual(tbl5ThirdRow.building_percentage === '' ||
                tbl5ThirdRow.building_percentage === undefined, true));

        it('tahsit', () =>
            assert.strictEqual(tbl5ThirdRow.tahsit, '35.64'));

        it('density yahad to dunam', () =>
            assert.strictEqual(tbl5ThirdRow.density_yahad_to_dunam === '' ||
                tbl5ThirdRow.density_yahad_to_dunam === undefined, true));

        it('number of housing units', () =>
            assert.strictEqual(tbl5ThirdRow.num_of_housing_units, ''));

        it('height of building meters', () =>
            assert.strictEqual(tbl5ThirdRow.height_above_entrance, '6'));

        it('floors above entrance', () =>
            assert.strictEqual(tbl5ThirdRow.floors_above, '1'));

        it('floors below entrance', () =>
            assert.strictEqual(tbl5ThirdRow.floors_below === undefined || tbl5ThirdRow.floorsBelow ==='',
                true));

        it('building right side line', () =>
            assert.strictEqual(tbl5ThirdRow.side_line_right, '3'));

        it('building left side line', () =>
            assert.strictEqual(tbl5ThirdRow.side_line_left, '3'));

        it('building back side line', () =>
            assert.strictEqual(tbl5ThirdRow.side_line_back, '3'));

        it('building front side line', () =>
            assert.strictEqual(tbl5ThirdRow.side_line_front, '5'));

    });
});

// This taba exists in the test to check for a case of tahsit and building percentage at one table
describe('Taba3 parsing test', () => {
    let data;
    const TEST_PLANS_DIR = 'test_plan3';

    before(async () =>
        data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR)));

    it('data should not be undefined', async () =>
        assert.notStrictEqual(data, undefined));

    it('data should have one row on table 5', () =>
        assert.strictEqual(data.chartFive.length, 1));

    it('should have only one row on table 1.8.1', () =>
        assert.strictEqual(data.charts18.chart181.length, 1));

    it('should have only one row on table 1.8.2', () =>
        assert.strictEqual(data.charts18.chart182.length, 1));

    it('should have no rows on table 1.8.3', () =>
        assert.strictEqual(data.charts18.chart183.length, 0));

    // interesting because it's ending is "הערה למגיש התכנית"
    describe('tables 1.8 parsing test', () => {

        describe('table 1.8.1 parsing test', () => {
            let tbl181FirstRow;

            before(() => {
                tbl181FirstRow = data.charts18.chart181[0];
            });

            it('profession', () => {
                assert.strictEqual(tbl181FirstRow.profession, '');
            });

            it('type', () => {
                assert.strictEqual(tbl181FirstRow.type, 'פרטי');
            });

            it('name', () => {
                assert.strictEqual(tbl181FirstRow.name, 'מוסא זבידאת');
            });

            it('license number', () => {
                assert.strictEqual(tbl181FirstRow.license_number, '');
            });

            it('corporate', () => {
                assert.strictEqual(tbl181FirstRow.corporate, '');
            });

            it('city', () => {
                assert.strictEqual(tbl181FirstRow.city, `סח'נין`);
            });

            it('street', () => {
                assert.strictEqual(tbl181FirstRow.street, ') 1 (');
            });

            it('house', () => {
                assert.strictEqual(tbl181FirstRow.house, '');
            });

            it('phone', () => {
                assert.strictEqual(tbl181FirstRow.phone, '054-4657371');
            });

            it('fax', () => {
                assert.strictEqual(tbl181FirstRow.fax, '04-6023162');
            });

            it('email', () => {
                assert.strictEqual(tbl181FirstRow.email, 'gawad.mosa@gmail.com');
            });

        });

        describe('table 1.8.2 parsing test', () => {
            let tbl182FirstRow;

            before(() => {
                tbl182FirstRow = data.charts18.chart182[0];
            });

            it('type', () => {
                assert.strictEqual(tbl182FirstRow.type, 'פרטי');
            });

            it('name', () => {
                assert.strictEqual(tbl182FirstRow.name, 'מוסא זבידאת');
            });

            it('license number', () => {
                assert.strictEqual(tbl182FirstRow.license_number, '');
            });

            it('corporate', () => {
                assert.strictEqual(tbl182FirstRow.corporate, '');
            });

            it('city', () => {
                assert.strictEqual(tbl182FirstRow.city, `סח'נין`);
            });

            it('street', () => {
                assert.strictEqual(tbl182FirstRow.street, `) 1 (`);
            });

            it('house', () => {
                assert.strictEqual(tbl182FirstRow.house, '');
            });

            it('phone', () => {
                assert.strictEqual(tbl182FirstRow.phone, '054-4657371');
            });

            it('fax', () => {
                assert.strictEqual(tbl182FirstRow.fax, '04-6023162');
            });

            it('email', () => {
                assert.strictEqual(tbl182FirstRow.email, 'gawad.mosa@gmail.com');
            });

        });
    });

    describe('Chart 5 parsing test', () => {
       let tbl5FirstRow;

        before(() =>
            tbl5FirstRow = data.chartFive[0]);

        it('building percentage', () =>
            assert.strictEqual(tbl5FirstRow.building_percentage, '144'));

        it('tahsit', () =>
            assert.strictEqual(tbl5FirstRow.tahsit, '42'));

        it('density yahad to dunam', () =>
            assert.strictEqual(tbl5FirstRow.density_yahad_to_dunam, '6'));

    });
});

// This taba exists in the test to check for a split table 5 (part A...) and across multiple pages
describe('Taba4 parsing test', () => {
    let data;
    const TEST_PLANS_DIR = 'test_plan4';

    before(async () =>
        data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR)));

    it('data should not be undefined', async () =>
        assert.notStrictEqual(data, undefined));

    it('data should have 13 row on table 5', () =>
        assert.strictEqual(data.chartFive.length, 13));

    it('data should have 1 row on table 1.8.3', () =>
        assert.strictEqual(data.charts18.chart183.length, 1));

    describe('table 1.8.3 parsing test', () => {
        let tbl183FirstRow;

        before(() => {
            tbl183FirstRow = data.charts18.chart183[0];
        });

        it('type', () => {
            assert.strictEqual(tbl183FirstRow.type, 'בבעלות רשות מקומית');
        });

        it('description', () => {
            assert.strictEqual(tbl183FirstRow.description, '');
        });

        it('name', () => {
            assert.strictEqual(tbl183FirstRow.name, '');
        });

        it('license number', () => {
            assert.strictEqual(tbl183FirstRow.license_number, '');
        });

        it('corporate', () => {
            assert.strictEqual(tbl183FirstRow.corporate, 'עיריית תל אביב-יפו');
        });

        it('city', () => {
            assert.strictEqual(tbl183FirstRow.city, `תל אביב- יפו`);
        });

        it('street', () => {
            assert.strictEqual(tbl183FirstRow.street, `אבן גבירול`);
        });

        it('house', () => {
            assert.strictEqual(tbl183FirstRow.house, '69');
        });

        it('phone', () => {
            assert.strictEqual(tbl183FirstRow.phone, '03-7247259');
        });

        // the library parses email and fax columns wrong

    });

});


// This taba makes the pdf reader library go into an infinite loop
describe('Taba5 parsing test', () => {
    let data;
    const TEST_PLANS_DIR = 'test_plan5';

    before(async () =>
        data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR)));

    it('', () =>
        assert.strictEqual(true, true));


});


describe('Taba6 parsing test', () => {
    let data;
    const TEST_PLANS_DIR = 'test_plan6';

    before(async () =>
        data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR)));

    it('data should not be undefined', async () =>
        assert.notStrictEqual(data, undefined));

    it('should have 3 rows on table 5', () =>
        assert.strictEqual(data.chartFive.length, 3));

    it('should have only one row on table 1.8.1', () =>
        assert.strictEqual(data.charts18.chart181.length, 1));

    it('should have only one row on table 1.8.2', () =>
        assert.strictEqual(data.charts18.chart182.length, 1));

    it('should have only one row on table 1.8.3', () =>
        assert.strictEqual(data.charts18.chart183.length, 1));

    describe('table 1.8.3 parsing test', () => {
        let tbl183FirstRow;

        before(() => {
            tbl183FirstRow = data.charts18.chart183[0];
        });

        it('type', () => {
            assert.strictEqual(tbl183FirstRow.type, 'בעלים');
        });

        it('description', () => {
            assert.strictEqual(tbl183FirstRow.description, '');
        });

        it('name', () => {
            assert.strictEqual(tbl183FirstRow.name, 'משה ברנס');
        });

        it('license number', () => {
            assert.strictEqual(tbl183FirstRow.license_number, '');
        });

        it('corporate', () => {
            assert.strictEqual(tbl183FirstRow.corporate, '');
        });

        it('city', () => {
            assert.strictEqual(tbl183FirstRow.city, `רמת גן`);
        });

        it('street', () => {
            assert.strictEqual(tbl183FirstRow.street, `טור הברושים`);
        });

        it('house', () => {
            assert.strictEqual(tbl183FirstRow.house, '3');
        });

        it('phone', () => {
            assert.strictEqual(tbl183FirstRow.phone, '');
        });



    });

});


