const fs = require('fs');
const path = require('path');



//TODO: ADD REF TO https://yeda.cs.technion.ac.il/resources_lexicons_stopwords.html in the readme
//Processing on the stopwords: taking only the words without the usage statistics, remove מדרך and add מתחם
//TODO: ADD MIGRATIONS THAT WILL CREATE AND POPULATE plan_area_changes table in DB



//returns a set of hebrew words
//we need this function to search for words that has prefix or suffix. for example: למתחם is מתחם, with the list of words
//we can know that למתחם contains a prefix or a suffix.
async function readStopWords() {
    // `rows` is an array of rows
    // each row being an array of cells
    const pth = path.join(__dirname, 'resources', 'stopwords.csv');
    const data = fs.readFileSync(pth, 'utf8');
    const words = data.split('\r\n');
    const wordsSet = new Set(words);
    wordsSet.delete('מדרך');   // it's a weird word and it's in there....
    wordsSet.add('מתחם');           //important words in the domain and it's not in the stopwords
    return wordsSet;
}

function includesOrList(sentence, words) {
    return words.reduce((acc, currWord) => acc || sentence.includes(currWord), false);
}

function notIncludes(sentence, word) {
    return !sentence.includes(word);
}

function includes(sentence, word) {
    return sentence.includes(word);
}

function tagDetail(tag, detail) {
    return {tag: tag, detail: detail};
}

function parseAreaDesignationChange(detail, stopWordsSet) {
    let currWord = '';
    let gatherWord = '';
    let fromIndex = -1;
    let toIndex = -1;
    let numberOfTimesChangedToIndex = 0;

    for(let i = 0; i < detail.length; i++) {
        const currChar = detail.charAt(i);

        if (currWord === ' ' || i === detail.length - 1) {
            //end of the word or the end of the sentence
            currWord = gatherWord;
            gatherWord = '';
            //from now we will check if this word contains the area changes (from... to...)

            //clean the word
            const wordToSearch = currWord.replace(',', '')
                                         .replace('(', '')
                                         .replace(')', '');

            if (fromIndex === -1 && currWord.startsWith('מ') && !stopWordsSet.has(wordToSearch)) {
                //didn't find from yet, starts with 'מ' and not in the stopWords (eliminates words like 'מנורה')
                //contains the from... area
                //fromIndex will be the index of the first letter of this word in the sentence
                fromIndex = i - currWord.length + 1;
            }
            else if (fromIndex !== -1 && currWord.startsWith('ל') && !stopWordsSet.has(wordToSearch)) {
                //contains the to... area
                //already found from, starts with 'ל' and not in the stopWords (eliminates words like 'לימון')
                // it's < 2 for situation like: דרך להולכי רגל ב
                if (numberOfTimesChangedToIndex < 2) {
                    toIndex = i - currWord.length + 1;
                }
                numberOfTimesChangedToIndex++;
            }
        }
        else {
            //it's not the end of the word, gather that char
            gatherWord = gatherWord.concat(currChar);
        }
    }
    if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
        const fromArea = detail.slice(fromIndex, toIndex - 2);
        const toArea = detail.slice(toIndex).replace('.', '');
        return {tag: 'AreaDesignationChange', fromArea: fromArea, toArea: toArea, detail: detail};
    }
    else {
        return {tag: 'AreaDesignationChange', fromArea: '', toArea: '', detail: detail};
    }
}

function parseDetail(detail, stopWordsSet) {
    if(includesOrList(detail, ['הפקעה', 'הפקעות'])) {
        return tagDetail('Expropriation', detail);
    }
    if(includes(detail, 'הנאה')) {
        return tagDetail('Movement', detail);
    }
    if(includesOrList(detail, ['שינוי יעוד', 'שינוי ייעוד', 'יעוד קרקע']) ||
        (includes(detail, 'שינוי') &&
            includesOrList(detail, ['איזור', 'אזור']) &&
            notIncludes(detail, 'גודל') &&
            notIncludes(detail, 'גובה'))) {
        return parseAreaDesignationChange(detail, stopWordsSet);
    }
    if(includes(detail, 'שימושים מותרים') ||
            (includesOrList(detail, ['קביעת', 'הגדרת']) && includes(detail, 'שימושים'))) {
        return tagDetail('LandUse', detail);
    }
    if(includes(detail, 'עצים')) {
        return tagDetail('Trees', detail);
    }
    if(includes(detail, 'שימור')) {
        return tagDetail('Preservation', detail);
    }
    if(includesOrList(detail, ['הריסה', 'הריסת', 'הריסות'])) {
        return tagDetail('Destruction', detail);
    }
    if(includes(detail, 'היתר')) {
        return tagDetail('Permit', detail);
    }
    if(includes(detail, 'עיצוב אדריכלי')) {
        return tagDetail('Architectural', detail);
    }
    if(includes(detail, 'שלבי')) {
        return tagDetail('Step', detail);
    }
    if(includesOrList(detail, ['איחוד', 'חלוקה'])) {
        return tagDetail('UnionAndDivision', detail);
    }
    if(includes(detail, 'קווי בניין') ||
        (includes(detail,'שינוי') && includesOrList(detail, ['בניין', 'בנין'])) ||
        (includes(detail,'קו') && includesOrList(detail, ['בנין', 'בניין']))) {
        return tagDetail('Building', detail);
    }
    if(includes(detail, 'תכסית')) {
        return tagDetail('Building', detail);
    }
    if(includesOrList(detail, ['זכויות בנייה', 'זכויות בניה'])) {
        return tagDetail('Building', detail);
    }
    if(includesOrList(detail, ['הגדלת', 'הקטנת', 'תוספת'])) {
        return tagDetail('Building', detail);
    }
    if(includes(detail, 'שימושים')) {
        return tagDetail('Building', detail);
    }
    if(includesOrList(detail, ['בינוי', 'בנייה', 'בניה'])) {
        return tagDetail('Building', detail);
    }
    if(includes(detail, 'קביעת')) {   // default for קביעת
        return tagDetail('Building', detail);
    }
}

module.exports = {
    parseDetail,
    readStopWords
};