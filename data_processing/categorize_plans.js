const fs = require("fs");
const path = require("path");
const { distance } = require("fastest-levenshtein");

//TODO: ADD REF TO https://yeda.cs.technion.ac.il/resources_lexicons_stopwords.html in the readme
//Processing on the stopwords: taking only the words without the usage statistics, remove מדרך and add מתחם

//input is raw details string from the db
//output is trimmed details in an array
function detailsStrToDetailsArr(detailsStr) {
    const firstIndexOfDetail = (detail) => {
        const isNumber = (char) => char >= "0" && char <= "9";
        const isHebLetter = (char) => char >= "א" && char <= "ת";
        const findIndexEndOfClauseNumber = () => {
            let seenNonSpace = false;
            for (let i = 0; i < detail.length; i++) {
                const char = detail.charAt(i);
                if (char !== " ") {
                    seenNonSpace = true;
                }
                //if it's the last char of the clause number (like the '.' in '2. some text blabla')
                //and the next char is not a number (for cases like '2.2 some text blabla)
                if (
                    seenNonSpace &&
                    (char === "-" || char === "." || char === " ") &&
                    !isNumber(detail.charAt(i + 1))
                ) {
                    return i + 1;
                }
            }
            //should never get here
            return null;
        };
        const indexEndOfClause = findIndexEndOfClauseNumber();
        if (indexEndOfClause === null) {
            return 0;
        }
        let prevWasSpace = false;
        // if the index of the start of the clause is mistake somehow, the following code
        // will know know that there's a mistake, and it will return 0 so we will not miss any data
        for (let i = 0; i < indexEndOfClause; i++) {
            const char = detail.charAt(i);
            // if the previous char was a space and the curr char is a hebrew letter
            // there's probably a mistake, so we will return 0 in order not to miss any data
            if (prevWasSpace && isHebLetter(char)) {
                return 0;
            }
            prevWasSpace = char === " ";
        }
        return indexEndOfClause;
    };
    const details = detailsStr ? detailsStr.split("<br>") : [];
    return details.map((detail) =>
        detail.substring(firstIndexOfDetail(detail)).trim()
    );
}

//returns a set of hebrew words
//we need this function to search for words that has prefix or suffix. for example: למתחם is מתחם, with the list of words
//we can know that למתחם contains a prefix or a suffix.
async function readStopWords() {
    // `rows` is an array of rows
    // each row being an array of cells
    const pth = path.join(__dirname, "resources", "stopwords.csv");
    const data = fs.readFileSync(pth, "utf8");
    const words = data.split("\n");
    return new Set(words);
}

function includesOrList(sentence, words) {
    return words.reduce(
        (acc, currWord) => acc || includes(sentence, currWord),
        false
    );
}

function notIncludes(sentence, word) {
    return !includes(sentence, word);
}

function includes(sentence, word) {
    return sentence.includes(word);
}

function tagDetail(tag, detail) {
    return { tag: tag, detail: detail };
}

function parseAreaDesignationChange(detail, stopWordsSet) {
    let currWord = "";
    let gatherWord = "";
    let fromIndex = -1;
    let toIndex = -1;
    let numberOfTimesChangedToIndex = 0;

    for (let i = 0; i < detail.length; i++) {
        const currChar = detail.charAt(i);

        if (currChar === " " || i === detail.length - 1) {
            //end of the word or the end of the sentence
            currWord = gatherWord;
            gatherWord = "";
            //from now we will check if this word contains the area changes (from... to...)

            //clean the word
            const wordToSearch = currWord.replace(/[,\(\)]/g, "");

            if (
                fromIndex === -1 &&
                currWord.startsWith("מ") &&
                !stopWordsSet.has(wordToSearch)
            ) {
                //didn't find from yet, starts with 'מ' and not in the stopWords (eliminates words like 'מנורה')
                //contains the from... area
                //fromIndex will be the index of the first letter of this word in the sentence
                fromIndex = i - currWord.length + 1;
            } else if (
                fromIndex !== -1 &&
                currWord.startsWith("ל") &&
                !stopWordsSet.has(wordToSearch)
            ) {
                //contains the to... area
                //already found from, starts with 'ל' and not in the stopWords (eliminates words like 'לימון')
                // it's < 2 for situation like: דרך להולכי רגל ב
                if (numberOfTimesChangedToIndex < 2) {
                    toIndex = i - currWord.length + 1;
                }
                numberOfTimesChangedToIndex++;
            }
        } else {
            //it's not the end of the word, gather that char
            gatherWord = gatherWord.concat(currChar);
        }
    }
    //check that the fromIndex was found and that toIndex was found, and that from is before to in the string
    if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
        //from and to will always come in something like:
        //ממגורים א' למגורים ד'
        //the "from" part is the string between the start of the from word until the start of the to word
        //in the next line it's toIndex - 2 because we don't want to take the space and the ל.
        const fromArea = detail.slice(fromIndex, toIndex - 2).trim();
        //the "to" part is from the beginning of the "to" word until the end of the sentence.
        //a dot to end the sentence might appear, so we will remove it.
        const toArea = detail.slice(toIndex).replace(".", "").trim();
        return {
            tag: "AreaDesignationChange",
            fromArea: fromArea,
            toArea: toArea,
            detail: detail,
        };
    } else {
        return {
            tag: "AreaDesignationChange",
            fromArea: "",
            toArea: "",
            detail: detail,
        };
    }
}

function parseDetail(detail, stopWordsSet) {
    if (includesOrList(detail, ["הפקעה", "הפקעות"])) {
        return tagDetail("Expropriation", detail);
    }
    if (includes(detail, "הנאה")) {
        return tagDetail("Movement", detail);
    }
    if (
        includesOrList(detail, ["שינוי יעוד", "שינוי ייעוד", "יעוד קרקע"]) ||
        (includes(detail, "שינוי") &&
            includesOrList(detail, ["איזור", "אזור"]) &&
            notIncludes(detail, "גודל") &&
            notIncludes(detail, "גובה"))
    ) {
        return parseAreaDesignationChange(detail, stopWordsSet);
    }
    if (
        includes(detail, "שימושים מותרים") ||
        (includesOrList(detail, ["קביעת", "הגדרת"]) &&
            includes(detail, "שימושים"))
    ) {
        return tagDetail("LandUse", detail);
    }
    if (includes(detail, "עצים")) {
        return tagDetail("Trees", detail);
    }
    if (includes(detail, "שימור")) {
        return tagDetail("Preservation", detail);
    }
    if (includesOrList(detail, ["הריסה", "הריסת", "הריסות"])) {
        return tagDetail("Destruction", detail);
    }
    if (includes(detail, "היתר")) {
        return tagDetail("Permit", detail);
    }
    if (includes(detail, "עיצוב אדריכלי")) {
        return tagDetail("Architectural", detail);
    }
    if (includes(detail, "שלבי")) {
        return tagDetail("Step", detail);
    }
    if (includesOrList(detail, ["איחוד", "חלוקה"])) {
        return tagDetail("UnionAndDivision", detail);
    }
    if (
        includes(detail, "קווי בניין") ||
        (includes(detail, "שינוי") &&
            includesOrList(detail, ["בניין", "בנין"])) ||
        (includes(detail, "קו") && includesOrList(detail, ["בנין", "בניין"]))
    ) {
        return tagDetail("Building", detail);
    }
    if (includes(detail, "תכסית")) {
        return tagDetail("Building", detail);
    }
    if (includesOrList(detail, ["זכויות בנייה", "זכויות בניה"])) {
        return tagDetail("Building", detail);
    }
    if (includesOrList(detail, ["הגדלת", "הקטנת", "תוספת"])) {
        return tagDetail("Building", detail);
    }
    if (includes(detail, "שימושים")) {
        return tagDetail("Building", detail);
    }
    if (includesOrList(detail, ["בינוי", "בנייה", "בניה"])) {
        return tagDetail("Building", detail);
    }
    if (includes(detail, "קביעת")) {
        // default for קביעת
        return tagDetail("Building", detail);
    }
}

function parseStrDetailsOfPlan(detailsStrOfPlan, stopWordsSet) {
    const detailsArr = detailsStrToDetailsArr(detailsStrOfPlan);
    return detailsArr.map((detail) => parseDetail(detail, stopWordsSet));
}

// returns list of {origin, tag}
function makeTags(mavatData) {
    const tags = [];

    // function that makes it easy to add the output of the tags maker functions into the tags list
    const addToTags = (tagOrUndefined) => {
        if (tagOrUndefined !== undefined) {
            tags.push(tagOrUndefined);
        }
    };

    // list of functions that takes mavatData as argument and returns undefined or tag
    const tagMakers = [
        makeTowerTag,
        makeUndergroundParkingTag,
        makePublicStateTag,
        makePublicStateEntrepreneurTag,
        makePublicLocalAuthorityTag,
        makePublicLocalAuthorityEntrepreneurTag,
        makePrivateEntrepreneurTag,
        makePrivateLandTag,
        makeGasStationTag,
        makeHighTowerTag
    ];

    // apply the tag makers on mavatData and add the tags that came out from it into the tags list
    tagMakers.map((tagMaker) => tagMaker(mavatData)).forEach(addToTags);

    return tags;
}

function makeTowerTag(mavatData) {
    function isTower(chartFiveRow) {
        return parseInt(chartFiveRow.floors_above) >= 10;
    }

    if (mavatData.chartFive.some(isTower)) {
        return {
            origin: "chart 5",
            tag: "tower",
        };
    }
    return undefined;
}
function makeHighTowerTag(mavatData) {
    function isHighTower(chartFiveRow) {
        return parseInt(chartFiveRow.floors_above) >= 30;
    }

    if (mavatData.chartFive.some(isHighTower)) {
        return {
            origin: "chart 5",
            tag: "high tower",
        };
    }
    return undefined;
}
// todo: public state tag
function makePublicStateTag(mavatData) {
    function isPublicStateTag(chart183row) {
        if (chart183row.type && chart183row.type.includes("בבעלות מדינה")) {
            return true;
        } else if (
            chart183row.corporate &&
            !chart183row.corporate.includes('בע"מ') &&
            (chart183row.corporate.includes('רמ"י') ||
                chart183row.corporate.includes("ישראל") ||
                chart183row.corporate.includes("ר.מ"))
        ) {
            return true;
        }
    }
    return mavatData.charts18.chart183.some(isPublicStateTag)
        ? {
              origin: "chart 1.8.3",
              tag: "PublicStateTag",
          }
        : undefined;
}
// todo: public local authority tag
function makePublicLocalAuthorityTag(mavatData) {
    function isPublicLocalAuthorityTag(chart183row) {
        if (
            chart183row.type &&
            chart183row.type.includes("בבעלות רשות מקומית")
        ) {
            return true;
        } else if (
            chart183row.type &&
            chart183row.type.includes("בעלים") &&
            chart183row.corporate.includes("עירי")
        ) {
            return true;
        } else if (
            chart183row.corporate.includes("מועצה") ||
            chart183row.corporate.includes("עירי") ||
            chart183row.corporate.includes("מ.מ")
        ) {
            return true;
        }
    }
    return mavatData.charts18.chart183.some(isPublicLocalAuthorityTag)
        ? {
              origin: "chart 1.8.3",
              tag: "PublicLocalAuthorityTag",
          }
        : undefined;
}
// todo: public state entrepreneur tag
function makePublicStateEntrepreneurTag(mavaData) {
    function isPublicStateEntrepreneurTag(chart182row) {
        if (chart182row.type && chart182row.type.includes("בבעלות מדינה")) {
            return true;
        } else if (
            chart182row.corporate &&
            (chart182row.corporate.includes("רמ״י") ||
                chart182row.corporate.includes("ישראל") ||
                chart182row.corporate.includes("ר.מ"))
        ) {
            return true;
        }
    }
    return mavaData.charts18.chart183.some(isPublicStateEntrepreneurTag)
        ? {
              origin: "chart 1.8.2",
              tag: "PublicStateEntrepreneurTag",
          }
        : undefined;
}
// todo: public local authority entrepreneur tag
function makePublicLocalAuthorityEntrepreneurTag(mavatData) {
    function isPublicLocalAuthorityEntrepreneurTag(chart182row) {
        if (
            chart182row.type &&
            chart182row.type.includes("בבעלות רשות מקומית")
        ) {
            return true;
        } else if (        // todo: check if this "if" statement is useless, because of last "if" with the "עירי" string
            chart182row.type &&
            chart182row.type.includes("בעלים") &&
            chart182row.corporate.includes("עירי")
        ) {
            return true;
        } else if (
            chart182row.corporate.includes("מועצה") ||
            chart182row.corporate.includes("עירי") ||
            chart182row.corporate.includes("מ.מ")
        ) {
            return true;
        }
    }
    return mavatData.charts18.chart183.some(
        isPublicLocalAuthorityEntrepreneurTag
    )
        ? {
              origin: "chart 1.8.2",
              tag: "PublicLocalAuthorityEntrepreneurTag",
          }
        : undefined;
}

// todo: private land tag
function makePrivateLandTag(mavatData) {
    function isPublicLocalAuthorityTag(chart183row) {
        if (
            chart183row.type &&
            chart183row.type.includes("בבעלות רשות מקומית")
        ) {
            return true;
        } else if (
            chart183row.type &&
            chart183row.type.includes("בעלים") &&
            chart183row.corporate.includes("עירי")
        ) {
            return true;
        } else if (
            chart183row.corporate.includes("מועצה") ||
            chart183row.corporate.includes("עירי") ||
            chart183row.corporate.includes("מ.מ")
        ) {
            return true;
        }
    }
    function isPublicStateTag(chart183row) {
        if (chart183row.type && chart183row.type.includes("בבעלות מדינה")) {
            return true;
        } else if (
            chart183row.corporate &&
            !chart183row.corporate.includes('בע"מ') &&
            (chart183row.corporate.includes('רמ"י') ||
                chart183row.corporate.includes("ישראל") ||
                chart183row.corporate.includes("ר.מ"))
        ) {
            return true;
        }
    }
    const isPrivateLand = (chart183row) => {
        if (chart183row.type && chart183row.type.includes("פרטי")) return true;
        return (
            !isPublicLocalAuthorityTag(chart183row) &&
            !isPublicStateTag(chart183row)
        );
    };

    return mavatData.chartFive.some(isPrivateLand)
        ? {
              tag: "privateLand",
              origin: "chart 1.8.3",
          }
        : undefined;
}
// todo: private entrepreneur tag
function makePrivateEntrepreneurTag(mavatData) {
    function isPublicStateEntrepreneurTag(chart182row) {
        if (chart182row.type && chart182row.type.includes("בבעלות מדינה")) {
            return true;
        } else if (
            chart182row.corporate &&
            (chart182row.corporate.includes("רמ״י") ||
                chart182row.corporate.includes("ישראל") ||
                chart182row.corporate.includes("ר.מ"))
        ) {
            return true;
        }
    }
    function isPublicLocalAuthorityEntrepreneurTag(chart182row) {
        if (
            chart182row.type &&
            chart182row.type.includes("בבעלות רשות מקומית")
        ) {
            return true;
        } else if (
            chart182row.type &&
            chart182row.type.includes("בעלים") &&
            chart182row.corporate.includes("עירי")
        ) {
            return true;
        } else if (
            chart182row.corporate &&
            (chart182row.corporate.includes("מועצה") ||
            chart182row.corporate.includes("עירי") ||
            chart182row.corporate.includes("מ.מ"))
        ) {
            return true;
        }
    }
    const isPrivateLand = (chart182row) => {
        if (chart182row.type && chart182row.type.includes("פרטי")) return true;
        return (
            !isPublicStateEntrepreneurTag(chart182row) &&
            !isPublicLocalAuthorityEntrepreneurTag(chart182row)
        );
    };

    return mavatData.chartFive.some(isPrivateLand)
        ? {
              tag: "privateEntrepreneur",
              origin: "chart 1.8.2",
          }
        : undefined;
}
function makeGasStationTag(mavatData) {
    const isGasStationTag = (chart4row) => (chart4row.father_category && chart4row.father_category.includes("תחנת תדלוק"));
    return mavatData.chartFour.some(isGasStationTag)
        ? {
            tag: "gasStation",
            origin: "chart 4",
        }
        : undefined;
}
function makeUndergroundParkingTag(mavatData) {
    const isUndergroundParking = (chart5Row) => {
        const use = chart5Row.use;

        return (
            chart5Row.floors_below &&
            use && // check that the strings are not undefined or null
            chart5Row.floors_below.match("^[1-9]+") && // starts with some number (not 0, not empty)
            (use.includes("משרדים") ||
                use.includes("מגורים") ||
                use.includes("תעסוקה") ||
                use.includes("מבנים ומוסדות ציבור"))
        );
    };

    return mavatData.chartFive.some(isUndergroundParking)
        ? {
              tag: "undergroundParking",
              origin: "chart 5",
          }
        : undefined;
}

module.exports = {
    parseDetail,
    readStopWords,
    detailsStrToDetailsArr,
    parseStrDetailsOfPlan,
    makeTags,
};
