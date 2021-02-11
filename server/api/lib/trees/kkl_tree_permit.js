const xlsx = require('xlsx');
const tpc = require ('../../model/tree_permit_constants');
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
} = tpc;

exports.KKLTreePermit = {

	[REGIONAL_OFFICE ] : 'קקל',
	[PERSON_REQUEST_NAME] : '  שם   בעל הרישיון',
	[REASON_DETAILED] :'סיבה  מילולית',
	[PLACE] : 'יישוב',
	[STREET_NUMBER] : '\'מס',
	[START_DATE] : 'מ-תאריך',
	[END_DATE] : 'עד-תאריך',
	[LAST_DATE_TO_OBJECTION] : 'תאריך אחרון להגשת ערר',
	[APPROVER_NAME] : 'שם   מאשר הרישיון',
	[APPROVER_TITLE] : 'אזור',
	[TREE_NAME] : 'שם   מין עץ',
	[COMMENTS_IN_DOC] : 'הערות',
	[PERMIT_NUMBER] : 'מספר רישיון',
	[PERMIT_ISSUE_DATE] : undefined,
	[ACTION] : 'פעולה',
	[STREET] : 'רחוב',
	[GUSH] : 'גוש',
	[HELKA] : 'חלקה',
	[REASON_SHORT] : 'סיבה',
	[NUMBER_OF_TREES] : 'מספר עצים',

	dateFormat : 'DD/MM/YYYY',
	urls : [
		'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/trees_befor.xlsx',
		'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/trees_after.xlsx'	
	],
	
	getRegionalOffice (row) {
		return 'קקל';
	},

	convertSheetToRows(sheet) {
		return xlsx.utils.sheet_to_json(sheet, { raw: false, range: 1, blankrows: false });
	},
};