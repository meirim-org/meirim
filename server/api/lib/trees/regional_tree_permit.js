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
} = require('../../model/tree_permit_constants');

exports.RegionalTreePermit = {

	[REGIONAL_OFFICE]: 'אזור',
	[PERSON_REQUEST_NAME]: 'מבקש',
	[REASON_DETAILED]: 'פרטי הסיבה',
	[PLACE]: 'מקום הפעולה',
	[STREET_NUMBER]: 'מספר',
	[START_DATE]: 'מתאריך',
	[END_DATE]: 'עד תאריך',
	[LAST_DATE_TO_OBJECTION]: 'תאריך אחרון להגשת ערער',
	[APPROVER_NAME]: 'שם מאשר',
	[APPROVER_TITLE]: 'תפיד מאשר',
	[TREE_NAME]: 'שם העץ',
	[COMMENTS_IN_DOC]: 'הערות לעצים',
	[PERMIT_NUMBER]: 'מספר רשיון',
	[PERMIT_ISSUE_DATE]: 'תאריך הרשיון',
	[ACTION]: 'פעולה',
	[STREET]: 'רחוב',
	[GUSH]: 'גוש',
	[HELKA]: 'חלקה',
	[REASON_SHORT]: 'סיבה',
	[NUMBER_OF_TREES]: 'מספר עצים',

	dateFormat: 'MM/DD/YYYY',
	urls: [
		'https://www.gov.il/BlobFolder/guide/pro_felling_trees/he/forestry_and_trees_falling_Befor_galil_golan.XLS',
		// Hach: the second item is duplicated because of lazy-load resposne timeout of gov.il server.
		// the first try fails, the second success. 
		'https://www.gov.il/BlobFolder/guide/pro_felling_trees/he/forestry_and_trees_falling_Befor_galil_golan.XLS',
		'https://www.gov.il/BlobFolder/guide/pro_felling_trees/he/forestry_and_trees_falling_after_galil_golan.XLS',

		'https://www.gov.il/BlobFolder/guide/pro_felling_trees/he/forestry_and_trees_falling_Befor_amakim_galil_gilboa.XLS',
		'https://www.gov.il/BlobFolder/guide/pro_felling_trees/he/forestry_and_trees_falling_after_amakim_galil_gilboa.XLS',

		'https://www.gov.il/BlobFolder/guide/pro_felling_trees/he/forestry_and_trees_falling_befor_merkaz-sharon.XLS',
		'https://www.gov.il/BlobFolder/guide/pro_felling_trees/he/forestry_and_trees_falling_after_merkaz_sharon.XLS',

		'https://www.gov.il/BlobFolder/guide/pro_felling_trees/he/forestry_and_trees_falling_Befor_merkaz_shfela.XLS',
		'https://www.gov.il/BlobFolder/guide/pro_felling_trees/he/forestry_and_trees_falling_after_merkaz_shfela.XLS',

		'https://www.gov.il/BlobFolder/guide/pro_felling_trees/he/forestry_and_trees_falling_Befor_jerusalem.XLS',
		'https://www.gov.il/BlobFolder/guide/pro_felling_trees/he/forestry_and_trees_falling_after_jerusalem.XLS',

		'https://www.gov.il/BlobFolder/guide/pro_felling_trees/he/forestry_and_trees_falling_Befor_darom.XLS',
		'https://www.gov.il/BlobFolder/guide/pro_felling_trees/he/forestry_and_trees_falling_after_darom.XLS',
		'https://www.gov.il/BlobFolder/guide/pro_felling_trees/he/forestry_and_trees_falling_Befortashtiot.XLS',
		'https://www.gov.il/BlobFolder/guide/pro_felling_trees/he/forestry_and_trees_falling_aftartashtiot.XLS',
		'https://www.gov.il/BlobFolder/guide/pro_felling_trees/he/forestry_and_trees_falling_befor_haifa.XLS',
		'https://www.gov.il/BlobFolder/guide/pro_felling_trees/he/forestry_and_trees_falling_after_haifa.XLS',
		'https://www.gov.il/BlobFolder/guide/pro_felling_trees/he/forestry_and_trees_falling_before-telaviv.XLS',
		'https://www.gov.il/BlobFolder/guide/pro_felling_trees/he/forestry_and_trees_falling_after-telaviv.XLS',
	],

	getRegionalOffice(row) {
		return row['אזור'];
	},
	convertSheetToRows(sheet) {
		return xlsx.utils.sheet_to_json(sheet, { raw: false });
	}

};