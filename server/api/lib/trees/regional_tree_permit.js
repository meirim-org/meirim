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

exports.RegionalTreePermit = {

	[REGIONAL_OFFICE] : 'אזור',
	[PERSON_REQUEST_NAME] : 'מבקש',
	[REASON_DETAILED] :'פרטי הסיבה',
	[PLACE] : 'מקום הפעולה',
	[STREET_NUMBER] : 'מספר',
	[START_DATE] : 'מתאריך',
	[END_DATE] : 'עד תאריך',
	[LAST_DATE_TO_OBJECTION] : 'תאריך אחרון להגשת ערער',
	[APPROVER_NAME] : 'שם מאשר',
	[APPROVER_TITLE] : 'תפיד מאשר',
	[TREE_NAME] : 'שם העץ',
	[COMMENTS_IN_DOC] : 'הערות לעצים',
	[PERMIT_NUMBER] : 'מספר רשיון',
	[PERMIT_ISSUE_DATE] : 'תאריך הרשיון',
	[ACTION] : 'פעולה',
	[STREET] : 'רחוב',
	[GUSH] : 'גוש',
	[HELKA] : 'חלקה',
	[REASON_SHORT] : 'סיבה',
	[NUMBER_OF_TREES] : 'מספר עצים',

	dateFormat : 'MM/DD/YYYY',
	urls : [
		'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/Befor_galil_golan.XLS',
		'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/after_galil_golan.XLS',

		'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/Befor_amakim_galil_gilboa.XLS',
		'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/after_amakim_galil_gilboa.XLS',

		'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/befor_merkaz-sharon.XLS',
		'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/after_merkaz-sharon.XLS',

		'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/Befor_merkaz_shfela.XLS',
		'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/after_merkaz_shfela.XLS',

		'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/Befor_jerusalem.XLS',
		'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/after_jerusalem.XLS',

		'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/Befor_darom.XLS',
		'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/after_darom.XLS',
	],

	getRegionalOffice (row) {
		return row['אזור'];
	},
	convertSheetToRows(sheet) {
		return xlsx.utils.sheet_to_json(sheet, { raw: false });
	}

};