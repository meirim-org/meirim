exports.TREE_PERMIT_TABLE = 'tree_permit';

exports.REGIONAL_OFFICE = 'regional_office';
exports.PERMIT_NUMBER ='permit_number';
exports.ACTION = 'action'; // cutting , copying
exports.PERMIT_ISSUE_DATE = 'permit_issue_date';
exports.PERSON_REQUEST_NAME = 'person_request_name';
exports.START_DATE = 'start_date';
exports.END_DATE = 'end_date';
exports.LAST_DATE_TO_OBJECTION = 'last_date_to_objection';
exports.APPROVER_NAME ='approver_name';
exports.APPROVER_TITLE = 'approver_title';

// Location
exports.PLACE = 'place';
exports.STREET = 'street';
exports.STREET_NUMBER = 'street_number';
exports.GUSH ='gush';
exports.HELKA = 'helka';

// Trees details
exports.TREE_NAME = 'tree_name';
exports.TREE_KIND = 'tree_kind';
exports.NUMBER_OF_TREES = 'number_of_trees';
exports.REASON_SHORT = 'reason_short';
exports.REASON_DETAILED = 'reason_detailed';
exports.COMMENTS_IN_DOC = 'comments_in_doc';

//Enriched data
exports.TOTAL_TREES = 'total_trees';
exports.TREES_PER_PERMIT = 'trees_per_permit';
exports.SENT = 'sent';
exports.GEOM = 'geom';
exports.URL = 'url';

exports.TEL_AVIV_FORMATS = ['תל אביב', 'תל אביב יפו', 'יפו', 'ת״א'];
exports.TEL_AVIV_OFFICAL = 'תל אביב -יפו';

exports.PARDES_HANA_FORMATS = ['פרדס חנה כרכור','כרכור','פרדס חנה'];
exports.PARDES_HANA_OFFICAL = 'פרדס חנה -כרכור';
exports.UNSUPPORTED_PLACES = [
	'אשדוד',
	'באר שבע',
	'באר-שבע',
	'גבעתיים',
	'גבעת שמואל',
	'גבעת-שמואל',
	'הוד השרון',
	'הוד-השרון',
	'חיפה',
	'יבנה',
	'יפו',
	'ירושלים',
	'נתניה',
	'פתח תקווה',
	'פתח-תקווה',
	'ראשון לציון',
	'ראשון-לציון',
	'רחובות',
	'רמת גן',
	'רמת-גן',
	'תל אביב - יפו',
	'תל אביב יפו',
	'תל אביב'
];

exports.SHEET_BEFORE = 'Data2ToExcel_BeforDate';
exports.SHEET_AFTER = 'Data2ToExcel_ToDate';
exports.KKL = 'Rep03-License-List-To-Excel-Las';