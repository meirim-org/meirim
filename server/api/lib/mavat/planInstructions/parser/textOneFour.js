const getNonTableInOneFour = (pageTables) => {
	const KIND_OF_PLAN_IDENTIFIER = '1.4סיווג התכניתסוג התכנית';
	const LAW_NUMBER_IDENTIFIER = 'לפי סעיף בחוק';
	const HEITER_IDENTIFIER = 'היתרים או הרשאות';
	const UNION_AND_DIVISION_IDENTIFIER = 'סוג איחוד וחלוקה';

	for (let i = 0; i < pageTables.length; i++) {
		const page = pageTables[i].tables;
		if (page.some(row => row.some(cell => cell.includes('זיהוי וסיווג התכנית') && cell.includes('1.')))) {
			// we got to the desired page
			for (let tableIdx = 0; tableIdx < page.length; tableIdx++) {
				const table = page[tableIdx];
				for (let cellIdx = 0; cellIdx < table.length; cellIdx++) {
					const cell = table[cellIdx];
					if (cell.includes('1.1שם התכנית')) {
						//we are in the correct cell!
						const splitCell = cell.split('\n');
						const data = {};
						for (let lineIdx = 0; lineIdx < splitCell.length; lineIdx++) {
							const line = splitCell[lineIdx];

							if (line.includes(KIND_OF_PLAN_IDENTIFIER)) {
								data.kindOfPlan = line.replace(KIND_OF_PLAN_IDENTIFIER, '').trim();
							}
							else if (line === 'של תכנית מפורטת' && lineIdx + 1 < splitCell.label) {
								data.isContainsDetailed = splitCell[lineIdx + 1];
							}
							else if (line.includes(LAW_NUMBER_IDENTIFIER)) {
								let currentLaws = line.replace(LAW_NUMBER_IDENTIFIER, '');
								for (let nextLineIdx = lineIdx + 1; nextLineIdx < splitCell.length; nextLineIdx++) {
									if (splitCell[nextLineIdx].includes(HEITER_IDENTIFIER)) {
										break;
									}
									currentLaws = currentLaws + splitCell[nextLineIdx].replace('\n', ' ');
								}
								data.laws = currentLaws.trim();
							}
							else if (line.includes(HEITER_IDENTIFIER)) {
								data.heiter = line.replace(HEITER_IDENTIFIER, '').trim();
							}
							else if (line.includes(UNION_AND_DIVISION_IDENTIFIER)) {
								data.union_and_division = line.replace(UNION_AND_DIVISION_IDENTIFIER, '').trim();
							}
						}
						return data;
					}

				}
			}

		}
	}
	return undefined;
};

module.exports = {
	getNonTableInOneFour
};