exports.notification_types = {
	NEW_PLAN_IN_AREA: 'NEW_PLAN_IN_AREA',
	NEW_PLAN_IN_GROUP: 'NEW_PLAN_IN_GROUP',
	STATUS_CHANGE: 'STATUS_CHANGE'
};

exports.personTypes = {
	'0': 'תושב/ת עם רצון לדעת ולהשפיע',
	'1': 'חבר מועצה/ועדת תכנון',
	'2': 'אדריכל/מתכנן/בעל מקצוע בתחום התכנון והבניה',
	'3': 'שמאי/רו״ח/עו״ד בתחום התכנון והבניה',
	'4': 'פעיל בארגון ללא מטרות רווח',
	'5': 'יזם',
	'6': 'אחר'
};

exports.meirimStatuses = {
	DEPOSIT: 'הפקדה',
	PUBLIC_OBJECTION: 'התנגדויות והערות הציבור',
	APPROVED: 'התוכנית אושרה',
	CANCELLED: 'תכנית מבוטלת'
};

const AREA_CHANGE_TYPES =  {
	NEW_USAGE: 'NEW_USAGE',
	INCREASED_USAGE: 'INCREASED_USAGE',
	PERCENT_INCREASE: 'PERCENT_INCREASE'
};
exports.AREA_CHANGE_TYPES = AREA_CHANGE_TYPES;

exports.tagDataRules = 
[
	{
		tagName: 'Housing',
		rules: [
			{
				usage: 'מגורים (מ"ר)' ,
				minValue: 1000,
				description: 'adds more than 1,000 Sq Meters of housing',
				changeType: AREA_CHANGE_TYPES.INCREASED_USAGE
			},
			{
				usage: 'מגורים (יח"ד)',
				minValue: 10,
				description: 'adds more than 10 units of housing',
				changeType: AREA_CHANGE_TYPES.INCREASED_USAGE
			}]
	},
	{ 
		tagName: 'Employment',
		rules: [
			{
				usage: 'תעסוקה (מ"ר)' ,
				minValue: 2000,
				description: 'adds more than 2,000 Sq Meters of commerce to plan with existing commerce',
				changeType: AREA_CHANGE_TYPES.INCREASED_USAGE
			},{
				usage: 'תעסוקה (מ"ר)' ,
				minValue: 200,
				description: 'adds more than 200 Sq Meters of employment, completely new',
				changeType: AREA_CHANGE_TYPES.NEW_USAGE
			}]
	},
	{ 
		tagName: 'Public',
		rules: [
			{
				usage: 'מבני ציבור (מ"ר)' ,
				minValue: 50,
				description: 'adds more than 50 Sq Meters of public area',
				changeType: AREA_CHANGE_TYPES.INCREASED_USAGE
			}]
	},
	{ 
		tagName: 'Commerce',
		rules: [
			{
				usage: 'מסחר (מ"ר)' ,
				minValue: 100 ,
				description: 'adds more than 100 Sq Meters of commerce',
				changeType: AREA_CHANGE_TYPES.INCREASED_USAGE
			},			{
				usage: 'מסחר (מ"ר)' ,
				minValue: 1 ,
				description: 'adds any Sq Meters of commerce where there was none',
				changeType: AREA_CHANGE_TYPES.NEW_USAGE
			},			{
				usage: 'מסחר (מ"ר)' ,
				minValue: 20 ,
				description: 'adds more than 20% commerce',
				changeType: AREA_CHANGE_TYPES.PERCENT_INCREASE
			}]
	},	
	{ 
		tagName: 'Hoteliery',
		rules: [
			{
				usage: 'חדרי מלון / תיירות (מ"ר)' ,
				minValue: 200 ,
				description: 'adds more than 200 Sq Meters of hoteliery',
				changeType: AREA_CHANGE_TYPES.INCREASED_USAGE
			},			{
				usage: 'חדרי מלון / תיירות (מ"ר)' ,
				minValue: 1 ,
				description: 'adds any Sq Meters of hoteliery where there was none',
				changeType: AREA_CHANGE_TYPES.NEW_USAGE
			},			{
				usage: 'חדרי מלון / תיירות (מ"ר)' ,
				minValue: 30 ,
				description: 'adds more than 30% hoteliery',
				changeType: AREA_CHANGE_TYPES.PERCENT_INCREASE
			}]
	},
];
	
	
	
