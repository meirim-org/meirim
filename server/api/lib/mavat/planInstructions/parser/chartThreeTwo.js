const pdfreader = require('pdfreader');   // we need a different PDF reader here because the tables PDF
// reader won't work in this scenario (the line at the table with סה"כ is very problematic)


// numbers like 19.11 (must be a number before the dot, have a dot and have 2 digits after the dot)
const NUMBER_REGEX = '^[0-9]+\\.[0-9][0-9]$';


class ChartThreeTwoBuilder {
	constructor(pdfPath) {
		this.pdfPath = pdfPath;
		this.promise = undefined;
		this.promiseResolveFunc = undefined;

		this.hasSeenTavlatShtahim = false;
		this.hasSeen3_2 = false;
		this.isInApprovedState = false;
		this.wasOnApprovedState = false;
		this.isInSuggestedState = false;
		this.prevTextHadSlash = false;
		this.prevEndedWithSpace = false;
		this.isDone = false;

		// left to right on the PDF table
		this.isOnPercenteges = false;
		this.isOnMr = false;
		this.isOnDesignation = false;

		this.linesApproved = [];
		this.linesSuggested = [];
		this.currLineObj = {};
	}

	startToRead(promise) {
		this.promise = promise;
		new pdfreader.PdfReader().parseFileItems(this.pdfPath, this.readElementFactory(this));
	}

	readLineInTable(thisObj, text, reversedText, isApprovedLines) {
		// it's the header or junk, we don't want that
		if (reversedText === 'אחוזים' || reversedText === 'אחוזים מחושב' || reversedText === 'מ' || reversedText === '"' ||
			reversedText === 'ר' || reversedText === 'ר מחושב' || reversedText === 'יעוד' ||
			reversedText.includes('תכנית מס') || reversedText.includes('מועד הפקה') || reversedText === 'תכנון זמין' ||
			reversedText.includes('מונה הדפסה') || reversedText === 'מצב מוצע' || reversedText === 'מצב מאושר') {
			return;
		}

		const isNumber = text.match(NUMBER_REGEX) !== null || text.match('^[0-9]{1,2}$') !== null || text === '100';

		if (thisObj.isOnDesignation && thisObj.prevTextHadSlash && isNumber) {
			// The prev had slash, but the new cell is actually a number
			// The previous value is being pushed, and prepares the data structure for getting new values
			thisObj.isOnDesignation = false;
			thisObj.isOnPercenteges = true;
			thisObj.prevTextHadSlash = false;

			if (isApprovedLines) {
				thisObj.linesApproved.push(this.currLineObj);
			} else {
				// suggested lines
				thisObj.linesSuggested.push(this.currLineObj);
			}

			thisObj.currLineObj = {};
		}

		if (thisObj.isOnPercenteges) {

			if (!isNumber || thisObj.prevEndedWithSpace) {
				// it's not actually percentage, so it appends to the previous designation column
				// it can be not a number or it can be a number when the previous "entry" ended with space.
				// Example text inside a cell:
				// מגורים 3 מיוחד
				// the pdf reader will divide it into:
				// מגורים(רווח)
				// 3
				// (רווח)מיוחד
				if (isApprovedLines) {
					thisObj.linesApproved[thisObj.linesApproved.length - 1].designation += reversedText;
				} else {
					// suggested lines
					thisObj.linesSuggested[thisObj.linesSuggested.length - 1].designation += reversedText;
				}

				// redo this for this entry
				thisObj.prevEndedWithSpace = reversedText[reversedText.length - 1] === ' ';
				return;
			}

			// the numbers should not be reversed
			thisObj.currLineObj.percentage = text;
			thisObj.isOnPercenteges = false;
			thisObj.isOnMr = true;
		} else if (thisObj.isOnMr) {
			thisObj.currLineObj.size_in_mr = text;
			thisObj.isOnMr = false;
			thisObj.isOnDesignation = true;
		} else if (thisObj.isOnDesignation) {

			if (!text.match(NUMBER_REGEX)) {
				if (thisObj.prevTextHadSlash) {
					// slash divides the text into 2 SOMETIMES
					thisObj.currLineObj.designation += text;
				}
				else {
					thisObj.currLineObj.designation = reversedText;
				}
			}

			const hasSlash = reversedText.includes('/');

			// advance the transition system only if you don't have a slash
			if (!hasSlash) {
				thisObj.isOnDesignation = false;
				thisObj.isOnPercenteges = true;

				if (isApprovedLines) {
					thisObj.linesApproved.push(this.currLineObj);
				} else {
					// suggested lines
					thisObj.linesSuggested.push(this.currLineObj);
				}

				thisObj.currLineObj = {};
			}

			thisObj.prevTextHadSlash = !!hasSlash;
			thisObj.prevEndedWithSpace = reversedText[reversedText.length - 1] === ' ';
		}
	}

	readElementFactory(thisObj) {

		return (err,item) => {
			if (err) {
				return;
			}
			// check that it's a text item before doing text stuff
			if (item && item.text) {

				if (thisObj.isDone) {
					return;
				}

				const text = item.text;
				const reversedText = text.split('').reverse().join('');

				if (!thisObj.hasSeenTavlatShtahim) {
					if (reversedText === 'טבלת שטחים') {
						thisObj.hasSeenTavlatShtahim = true;
					}
				}

				if (!thisObj.hasSeen3_2) {
					if (text === '3.2') {
						thisObj.hasSeen3_2 = true;
					}
				}

				else if (thisObj.hasSeen3_2 && !thisObj.isInApprovedState && !thisObj.isInSuggestedState) {
					if (reversedText === 'מצב מאושר') {
						thisObj.isInApprovedState = true;
						thisObj.wasOnApprovedState = true;
						// the first column will be percentage (left to right)
						thisObj.isOnPercenteges = true;
						thisObj.isOnMr = false;
						thisObj.isOnDesignation = false;
						// make sure that the line obj is clean
						thisObj.currLineObj = {};
					}

					else if (reversedText === 'מצב מוצע' && !thisObj.isInSuggestedState) {
						if (thisObj.currLineObj.percentage !== undefined &&
							thisObj.currLineObj.size_in_mr !== undefined &&
							thisObj.currLineObj.designation !== undefined) {
							// the last line in approved state probably had slash or something like that,
							// so we need to push it anyway
							// we check that it has all 3 fields in order not to push incomplete lines
							thisObj.linesApproved.push(this.currLineObj);
						}
						thisObj.isInSuggestedState = true;
						// the first column will be percentage (left to right)
						thisObj.isOnPercenteges = true;
						thisObj.isOnMr = false;
						thisObj.isOnDesignation = false;
						thisObj.prevTextHadSlash = false;
						thisObj.prevEndedWithSpace = false;
						// clean this line obj
						thisObj.currLineObj = {};
					}
				}

				else if (reversedText === 'סה' && (thisObj.isInApprovedState || thisObj.isInSuggestedState)) {
					if (thisObj.isInSuggestedState) {
						thisObj.isDone = true;
						thisObj.promiseResolveFunc();
					}
					thisObj.isInSuggestedState = false;
					thisObj.isInApprovedState = false;

				}

				else if (thisObj.isInApprovedState) {
					if (text === '100' && thisObj.linesApproved.length > 0) {
						thisObj.isInSuggestedState = false;
						thisObj.isInApprovedState = false;

						return;
					}
					this.readLineInTable(thisObj, text, reversedText, true);
				}

				else if (thisObj.isInSuggestedState) {
					if (text === '100' && thisObj.linesSuggested.length > 0) {
						thisObj.isInSuggestedState = false;
						thisObj.isInApprovedState = false;

						thisObj.isDone = true;
						thisObj.promiseResolveFunc();

						return;
					}
					this.readLineInTable(thisObj, text, reversedText, false);
				}
			}
		};


	}
}


async function extractChartThreeTwo(pathToPdf) {

	const chartBuilder = new ChartThreeTwoBuilder(pathToPdf);

	const promise = new Promise(resolve => {
		// hack to resolve the promise from outside of this scope
		chartBuilder.promiseResolveFunc = resolve;
	});
	chartBuilder.startToRead(promise);
	await promise;

	return {
		'chart3_2_approved': chartBuilder.linesApproved,
		'chart3_2_suggested': chartBuilder.linesSuggested
	};

}

module.exports = {
	extractChartThreeTwo
};