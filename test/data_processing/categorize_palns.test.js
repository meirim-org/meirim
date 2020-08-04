const Classifier = require('../../data_processing/categorize_plans');
const assert = require('assert');

//all the tests are from actual tabas

describe('classification test', function() {
    let stopWordsSet;

    before(async () => {
        stopWordsSet = await Classifier.readStopWords();
    });

    it('should be tagged as Expropriation', () => {
        const obj = Classifier.parseDetail('קביעת הוראות להפקעה', stopWordsSet);
        assert.strictEqual(obj.tag, 'Expropriation');
    });

    it('should be tagged as Expropriation', () => {
        const obj = Classifier.parseDetail('קביעת הוראות הפקעה לשטח ציבורי פתוח.', stopWordsSet);
        assert.strictEqual(obj.tag, 'Expropriation');
    });

    it('should be tagged as Expropriation', () => {
        const obj = Classifier.parseDetail('קביעת הוראות בגין הפקעה לצרכי ציבור .', stopWordsSet);
        assert.strictEqual(obj.tag, 'Expropriation');
    });

    it('should be tagged as Movement', () => {
        const obj = Classifier.parseDetail('קביעת זיקת הנאה למעבר ברכב בתחום השצ"פ.', stopWordsSet);
        assert.strictEqual(obj.tag, 'Movement');
    });

    it('should be tagged as Movement', () => {
        const obj = Classifier.parseDetail('קביעת זיקות הנאה למעבר רגלי במגרש מגורים ד\'.', stopWordsSet);
        assert.strictEqual(obj.tag, 'Movement');
    });

    it('should be tagged as Movement', () => {
        const obj = Classifier.parseDetail('קביעת שטחים והוראות לזיקת הנאה לציבור.', stopWordsSet);
        assert.strictEqual(obj.tag, 'Movement');
    });

    it('should be tagged as AreaDesignationChange and be from שצ"פ to דרך מוצעת', () => {
        const obj = Classifier.parseDetail('שינוי יעוד משצ"פ לדרך מוצעת.', stopWordsSet);
        assert.strictEqual(obj.tag, 'AreaDesignationChange');
        assert.strictEqual(obj.fromArea, 'שצ"פ');
        assert.strictEqual(obj.toArea, 'דרך מוצעת');
    });

    it('should be tagged as AreaDesignationChange and be from מגורים 5 מיוחד to מגורים ב\'', () => {
        const obj = Classifier.parseDetail('שינוי ייעוד הקרקע ממגורים 5 מיוחד למגורים ב\'.', stopWordsSet);
        assert.strictEqual(obj.tag, 'AreaDesignationChange');
        assert.strictEqual(obj.fromArea, 'מגורים 5 מיוחד');
        assert.strictEqual(obj.toArea, 'מגורים ב\'');
    });

    it('should be tagged as AreaDesignationChange and be from אזור מגורים ד\'1 to מגורים ד\'', () => {
        const obj = Classifier.parseDetail('שינוי יעוד מאזור מגורים ד\'1 למגורים ד\'', stopWordsSet);
        assert.strictEqual(obj.tag, 'AreaDesignationChange');
        assert.strictEqual(obj.fromArea, 'אזור מגורים ד\'1');
        assert.strictEqual(obj.toArea, 'מגורים ד\'');
    });

    it('should be tagged as AreaDesignationChange and be from שטח חקלאי, שטח ציבורי פתוח ושטח ללא תכנון מפורט to דרך', () => {
        const obj = Classifier.parseDetail('שינוי ייעוד משטח חקלאי, שטח ציבורי פתוח ושטח ללא תכנון מפורט לדרך.', stopWordsSet);
        assert.strictEqual(obj.tag, 'AreaDesignationChange');
        assert.strictEqual(obj.fromArea, 'שטח חקלאי, שטח ציבורי פתוח ושטח ללא תכנון מפורט');
        assert.strictEqual(obj.toArea, 'דרך');
    });

    it('should be tagged as AreaDesignationChange and be from מעבר ציבורי להולכי רגל to דרך', () => {
        const obj = Classifier.parseDetail('שינוי ייעוד ממעבר ציבורי להולכי רגל לדרך.', stopWordsSet);
        assert.strictEqual(obj.tag, 'AreaDesignationChange');
        assert.strictEqual(obj.fromArea, 'מעבר ציבורי להולכי רגל');
        assert.strictEqual(obj.toArea, 'דרך');
    });



    it('should be tagged as LandUse', () => {
        const obj = Classifier.parseDetail('הגדרת שימושים מותרים לשטח השצ"פ.', stopWordsSet);
        assert.strictEqual(obj.tag, 'LandUse');
    });

    it('should be tagged as LandUse', () => {
        const obj = Classifier.parseDetail('קביעת השימושים המותרים.', stopWordsSet);
        assert.strictEqual(obj.tag, 'LandUse');
    });

    it('should be tagged as Trees', () => {
        const obj = Classifier.parseDetail('קביעת הוראות בגין נטיעת עצים בוגרים', stopWordsSet);
        assert.strictEqual(obj.tag, 'Trees');
    });

    it('should be tagged as Trees', () => {
        const obj = Classifier.parseDetail('קביעת הוראות לשימור, נטיעה, העתקה וכריתת  עצים בוגרים.', stopWordsSet);
        assert.strictEqual(obj.tag, 'Trees');
    });

    it('should be tagged as Trees', () => {
        const obj = Classifier.parseDetail('קביעת הוראות בגין עצים לשימור.', stopWordsSet);
        assert.strictEqual(obj.tag, 'Trees');
    });

    it('should be tagged as Preservation', () => {
        const obj = Classifier.parseDetail('קביעת מבנה לשימור ומתן הנחיות לשימור, בנייה ופיתוח בסביבתו.', stopWordsSet);
        assert.strictEqual(obj.tag, 'Preservation');
    });

    it('should be tagged as Preservation', () => {
        const obj = Classifier.parseDetail('קביעת הוראות לשימור מבנים ואתרים היסטוריים.', stopWordsSet);
        assert.strictEqual(obj.tag, 'Preservation');
    });

    it('should be tagged as Destruction', () => {
        const obj = Classifier.parseDetail('קביעת הוראות בגין מבנים מדרגות וגדרות להריסה.', stopWordsSet);
        assert.strictEqual(obj.tag, 'Destruction');
    });

    it('should be tagged as Destruction', () => {
        const obj = Classifier.parseDetail('קביעת הוראות בגין סככה,מבנה להריסה.', stopWordsSet);
        assert.strictEqual(obj.tag, 'Destruction');
    });

    it('should be tagged as Permit', () => {
        const obj = Classifier.parseDetail('קביעת תנאים למתן היתר בניה.', stopWordsSet);
        assert.strictEqual(obj.tag, 'Permit');
    });

    it('should be tagged as Permit', () => {
        const obj = Classifier.parseDetail('קביעת הוראות בנוי ופיתוח וקביעת תנאים למתן היתר בניה.', stopWordsSet);
        assert.strictEqual(obj.tag, 'Permit');
    });

    it('should be tagged as Architectural', () => {
        const obj = Classifier.parseDetail('שינוי של הוראות לפי תכנית בדבר בינוי או עיצוב אדריכליים לפי סעיף 62א (א) (5) לחוק.', stopWordsSet);
        assert.strictEqual(obj.tag, 'Architectural');
    });

    it('should be tagged as Architectural', () => {
        const obj = Classifier.parseDetail('שינוי הוראות בינוי /עיצוב אדריכלי בהתאם לסעיף 62א(א)5.', stopWordsSet);
        assert.strictEqual(obj.tag, 'Architectural');
    });

    it('should be tagged as Step', () => {
        const obj = Classifier.parseDetail('קביעת שלבי ביצוע למימוש התכנית.', stopWordsSet);
        assert.strictEqual(obj.tag, 'Step');
    });

    it('should be tagged as Step', () => {
        const obj = Classifier.parseDetail('קביעת שלבי ביצוע להקמת הבניה , כאמור.', stopWordsSet);
        assert.strictEqual(obj.tag, 'Step');
    });

    it('should be tagged as UnionAndDivision', () => {
        const obj = Classifier.parseDetail('קביעת הוראות להכנת תכנית איחוד וחלוקה בתכנית עתידית.', stopWordsSet);
        assert.strictEqual(obj.tag, 'UnionAndDivision');
    });

    it('should be tagged as UnionAndDivision', () => {
        const obj = Classifier.parseDetail('איחוד וחלוקה של מגרשים לפי סעיף 62 א (א) 1 לחוק התכנון והבניה.', stopWordsSet);
        assert.strictEqual(obj.tag, 'UnionAndDivision');
    });

    it('should be tagged as UnionAndDivision', () => {
        const obj = Classifier.parseDetail('חלוקה בהסכמה', stopWordsSet);
        assert.strictEqual(obj.tag, 'UnionAndDivision');
    });

    it('should be tagged as Building', () => {
        const obj = Classifier.parseDetail('שינוי בקווי בניין :', stopWordsSet);
        assert.strictEqual(obj.tag, 'Building');
    });

    it('should be tagged as Building', () => {
        const obj = Classifier.parseDetail('שינוי בקו בניין קדמי מ- 3.0 לפי המסומן בתשריט.', stopWordsSet);
        assert.strictEqual(obj.tag, 'Building');
    });

    it('should be tagged as Building', () => {
        const obj = Classifier.parseDetail('הגדלת תכסית קרקע מ-36% ל- 45%', stopWordsSet);
        assert.strictEqual(obj.tag, 'Building');
    });

    it('should be tagged as Building', () => {
        const obj = Classifier.parseDetail('שינוי הוראות בדבר בינוי לפי סעיף 62 א (א)5.', stopWordsSet);
        assert.strictEqual(obj.tag, 'Building');
    });

});


describe('split string details to array of details test', () => {

    it('should split correctly', () => {
        const detailsStr = 'א. שינוי בקווי בניין :<br>1. שינוי בקו בניין קדמי מ- 3.0 לפי המסומן בתשריט.<br>2. שינוי בקו בניין צדדי ( צד דרומי)מ- 3.0 לפי המסומן בתשריט.<br>ב. הגדלת תכסית קרקע מ-36% ל- 45%';
        const arr = Classifier.detailsStrToDetailsArr(detailsStr);
        assert.strictEqual(arr[0], 'שינוי בקווי בניין :');
        assert.strictEqual(arr[1], 'שינוי בקו בניין קדמי מ- 3.0 לפי המסומן בתשריט.');
        assert.strictEqual(arr[2], 'שינוי בקו בניין צדדי ( צד דרומי)מ- 3.0 לפי המסומן בתשריט.');
        assert.strictEqual(arr[3], 'הגדלת תכסית קרקע מ-36% ל- 45%');
    });

});

