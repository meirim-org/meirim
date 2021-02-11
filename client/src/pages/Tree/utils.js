const moment = require('moment');
const DAY_IN_MILISECONDS = 1000 * 60 * 60 *24;


export const timeToObjectionText =(start_date) => {
	const permitStartDate = moment(start_date);
	const now = moment();
	const timeLeft = (permitStartDate.diff(now, 'hours') > 0)?  permitStartDate.diff(now, 'days') : -1; 
	if (!start_date) {return 'לא צוין תאריך'};
	if (timeLeft === -1) { return 'בתוקף';}
	else if (timeLeft === 0) { return `יום אחרון`}
	else if (timeLeft === 1) { return `נותר יום אחד`}
	else return  `נותרו ${timeLeft} ימים`;
}

export const tabIsActive = (tab, pathData) => {
	const { pathName, treeId } = pathData;
	if ( tab === 'summary') return [`/tree/${treeId}/`, `/tree/${treeId}`].includes(pathName);

	return pathName.includes(tab);
};

export const goBack = () => window.history.go(-1);

export const pageTitleText = (totalTrees, street, streetNumber) => {
	const treeText = (totalTrees === 1) ? 'עץ אחד' : `${totalTrees} עצים`;
	if (street) {
		return `${treeText} ב${street} ${streetNumber || ''}`;
	} else {
		return treeText;
	}
};
