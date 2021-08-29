exports.notification_types = {
	NEW_PLAN_IN_AREA: 'NEW_PLAN_IN_AREA',
	NEW_PLAN_IN_GROUP: 'NEW_PLAN_IN_GROUP',
	STATUS_CHANGE: 'STATUS_CHANGE'
};

exports.personTypes = {
	'0': 'תושב/ת עם רצון לדעת ולהשפיע',
	'1': 'חבר מועצה/ועדת תכנון',
	'2': 'אדרכיל/מתכנן/בעל מקצוע בתחום התכנון והבניה',
	'3': 'שמאי/רו״ח/עו״ד בתחום התכנון והבניה',
	'4': 'פעיל בארגון ללא מטרות רווח',
	'5': 'יזם',
	'6': 'אחר'
};

const area_change_types =  {
	NEW_USAGE: 'NEW_USAGE',
	INCREASED_USAGE: 'INCREASED_USAGE',
	PERCENT_INCREASE: 'PERCENT_INCREASE'
};

exports.area_change_types = area_change_types;

exports.tagDataRules = 
[
	{
	tagName: 'דיור',
	rules: [
		 {
			usage: 'מגורים (מ"ר)' ,
			minValue: 1000,
			description: 'adds more than 1,000 Sq Meters of housing',
			changeType: area_change_types.INCREASED_USAGE
		},
		 {
			usage: 'מגורים (יח"ד)',
			minValue: 10,
			description: 'adds more than 10 units of housing',
			changeType: area_change_types.INCREASED_USAGE
		}]
	},
	{ 
	tagName: 'תעסוקה ותעשיה',
	rules: [
		{
			usage: 'תעסוקה (מ"ר)' ,
			minValue: 2000,
			description: 'adds more than 2,000 Sq Meters of commerce to plan with existing commerce',
			changeType: area_change_types.INCREASED_USAGE
		},{
			usage: 'תעסוקה (מ"ר)' ,
			minValue: 200,
			description: 'adds more than 200 Sq Meters of employment, completely new',
			changeType: area_change_types.NEW_USAGE
		}]
	},
	{ 
	tagName: 'מבני ציבור',
	rules: [
		{
			usage: 'מבני ציבור (מ"ר)' ,
			minValue: 50,
			description: 'adds more than 50 Sq Meters of public area',
			changeType: area_change_types.INCREASED_USAGE
		}]
	},
	{ 
		tagName: 'מסחר',
		rules: [
			{
				usage: 'מסחר (מ"ר)' ,
				minValue: 100 ,
				description: 'adds more than 100 Sq Meters of commerce',
				changeType: area_change_types.INCREASED_USAGE
			},			{
				usage: 'מסחר (מ"ר)' ,
				minValue: 1 ,
				description: 'adds any Sq Meters of commerce where there was none',
				changeType: area_change_types.NEW_USAGE
			},			{
				usage: 'מסחר (מ"ר)' ,
				minValue: 20 ,
				description: 'adds more than 20% commerce',
				changeType: area_change_types.PERCENT_INCREASE
			}]
		},	
		{ 
			tagName: 'תיירות',
			rules: [
				{
					usage: 'חדרי מלון / תיירות (מ"ר)' ,
					minValue: 200 ,
					description: 'adds more than 200 Sq Meters of hoteliery',
					changeType: area_change_types.INCREASED_USAGE
				},			{
					usage: 'חדרי מלון / תיירות (מ"ר)' ,
					minValue: 1 ,
					description: 'adds any Sq Meters of hoteliery where there was none',
					changeType: area_change_types.NEW_USAGE
				},			{
					usage: 'חדרי מלון / תיירות (מ"ר)' ,
					minValue: 30 ,
					description: 'adds more than 30% hoteliery',
					changeType: area_change_types.PERCENT_INCREASE
				}]
			},
]
	
	
	
