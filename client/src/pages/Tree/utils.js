const DAY_IN_MILISECONDS = 1000 * 60 * 60 *24;

export const timeToObjectionText =(start_date) => {
	const permitStartDate = new Date(start_date);
	const now = new Date();
	const timeLeft = (permitStartDate.getTime() - now.getTime() > 0)?  Math.floor((permitStartDate - now) / DAY_IN_MILISECONDS ) : -1; 
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
