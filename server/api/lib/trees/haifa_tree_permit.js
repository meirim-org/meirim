const xlsx = require('xlsx');
const {
	REGIONAL_OFFICE,
	PERSON_REQUEST_NAME,
	REASON_DETAILED,
	PLACE,
	STREET_NUMBER,
	START_DATE,
	END_DATE,
	LAST_DATE_TO_OBJECTION,
	APPROVER_NAME,
	APPROVER_TITLE,
	TREE_NAME,
	COMMENTS_IN_DOC,
	PERMIT_NUMBER,
	PERMIT_ISSUE_DATE,
	ACTION,
	GUSH,
	HELKA,
	STREET,
	REASON_SHORT,
	NUMBER_OF_TREES
} = require ('../../model/tree_permit_constants');

exports.HaifaTreePermit = {

	[REGIONAL_OFFICE] : 'חיפה',
	[PERSON_REQUEST_NAME] : 'שם',
	[REASON_DETAILED] :'סיבה2',
	[PLACE] : 'מקום הבקשה',
	[STREET_NUMBER] : 'בית',
	[START_DATE] : undefined,
	[END_DATE] : undefined,
	[LAST_DATE_TO_OBJECTION] : 'תאריך אחרון לערעור',
	[APPROVER_NAME] : undefined,
	[APPROVER_TITLE] : undefined,
	[TREE_NAME] : 'שם עץ',
	[COMMENTS_IN_DOC] : 'הערות לבקשה',
	[PERMIT_NUMBER] : 'מספר בקשה',
	[PERMIT_ISSUE_DATE] : 'תאריך בקשה',
	[ACTION] : 'פעולה',
	[STREET] : 'רח',
	[GUSH] : undefined,
	[HELKA] : undefined,
	[REASON_SHORT] : 'סיבה',
	[NUMBER_OF_TREES] : 'מספר עצים',

	dateFormat : 'DD/MM/YYYY',
	urls : [
		'https://haifa-tree-felling-permits.s3.eu-central-1.amazonaws.com/rptPirsum.xlsx'
	],

	getRegionalOffice (row) {
		return 'חיפה';
	},

	convertSheetToRows(sheet) {
		return xlsx.utils.sheet_to_json(sheet, { raw: false });
	}
};