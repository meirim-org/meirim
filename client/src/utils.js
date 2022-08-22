import ReactGA from 'react-ga';

export const renderMultiplier = areaObj =>
	Math.round(((areaObj.new + areaObj.exist) / areaObj.exist) * 100) / 100;

export const renderPercent = number => Math.round(number * 100);

export const parseNumber = string => {
	if(!string) return 0;
	
	string = string.replace(',', '');
	if (parseInt(string)) {
		return parseInt(string.replace(',', ''));
	}
	if (string.charAt(0) === '-') {
		return -parseInt(string.slice(1));
	}
	
	return 0;
};

export const tabIsActive = (tab, pathData) => {
	const { pathName, planId } = pathData;
	if ( tab === 'summary') return [`/plan/${planId}/`, `/plan/${planId}`].includes(pathName);

	return pathName.includes(tab);
};

export const scrollToTop = () => {
	// use setTimeout since the page is not rendered when we get here and scrolls to
	// top end up being scrolls to someplace mid-page
	setTimeout(() => window.scroll({ top: 0, left: 0, behavior: 'smooth' }), 100);
};

export const gaPageView = (location, isAuthenticated) => {
	const page = location.pathname + location.search + location.hash;

	ReactGA.set({
		page,
		dimension1: isAuthenticated
	});
	ReactGA.pageview(page);
};

export const reportToAnalytics = (params) => {
	//eslint-disable-next-line
	if (dataLayer && dataLayer.push) {
	//eslint-disable-next-line
		dataLayer.push(params);
	};
};