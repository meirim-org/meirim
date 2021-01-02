import { parseNumber } from 'utils';
import t from 'locale/he_IL';

export const axes = [
	{ primary: true, type: 'ordinal', position: 'bottom' },
	{ position: 'left', type: 'linear', stacked: true }
];

export const initialDataArea = [
	{
		label: 'זכויות קיימות',
		data: []
	},
	{
		label: 'זכויות מבוקשות',
		data: []
	}	
];

export const initialDataUnits = [
	{
		label: 'יחידות קיימות',
		data: []
	},
	{
		label: 'יחידות מבוקשות',
		data: []
	}
];

export const initialPlanData = { 
	countyName: '',
	planName: '', 
	status: '', 
	type:'', 
	goalsFromMavat: '',
	planUrl: '',
	areaChanges: '',
	geom: ''
};

export const initialTextArea ={
	exist: 0,
	new: 0,
	area:0
};

export const series = { type: 'bar' };

export const areaChangeHandlers = {
	'meter': (change) => handleMetersChange(change),
	'nonMeter': (change) => handleNotMeterChange(change)
};

export const getAreaChangeType = (c) => {
	return c[3].includes('מ"ר') ? 'meter' : 'nonMeter';
};

const handleMetersChange = (change) => {
	return [{ x:change[3], y:parseNumber(change[5]) }, { x:change[3], y:parseNumber(change[6]) }];
};

const handleNotMeterChange = (change) => {
	return [{ x:change[3], y:parseNumber(change[5]) }, { x:change[3], y:parseNumber(change[6]) }];
};

export const printRadioClass = (selectedValue, radioValue, validationRrror) => {
	let classes = [];

	if (selectedValue === radioValue) {
		classes.push('active');
	}

	if (validationRrror) {
		classes.push('error');
	}

	return classes.join();
};

export const daysPassed = (date) => {
	const timestamp = new Date(date.replace(' ', 'T')).getTime();
	const oneDay = 24 * 60 * 60 * 1000;
	const today = Date.now();

	return ` ${Math.round(Math.abs((today - timestamp) / oneDay))} `;
};

export const handleNewCommentSubmit = (type, setTypeError) => {
	if (!type ) { setTypeError(true); };
};


export const extractComments = (comments) => {
	const forDeletion = [];
	console.log("🚀 ~ file: utils.js ~ line 112 ~ extractComments ~ comments", comments)
	comments.map((comment) => {
		let parentId = comment.parent_id;

		if (parentId !== null ) {
			let parent = comments.find(comment => comment.id === parentId);
			if (parent && parent.subComments === undefined) {
				parent.subComments = [];
			} 
			parent.subComments.push(comment);
			forDeletion.push(comment.id);
		}
	});
	comments = comments.filter(item => !forDeletion.includes(item.id));

	return comments;
};

export const goBack = () => window.history.go(-1);

export const commentTypes = [
	{
		value: 'improvement',
		text: t.improvementProposal
	},
	{
		value: 'review',
		text: t.review
	},
	{
		value: 'general',
		text: t.generalOpinion
	},
];

export const planTerms = ['פינוי בינוי', 'חלוקת מגרשים', 'שיקום עירוני'];