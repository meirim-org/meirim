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

exports.tags = [
	{'tagName':'דיור' , 'tagId':'1', 'functionName': 'isHousing'}
]

exports.tagDataRules = {
	housingByArea: {
		usage: 'מגורים (מ"ר)' ,
		minValue: 1000,
		description: 'adds more than 1,000 Sq Meters of housing'
	},
	housingByUnits: {
		usage: 'מגורים (יח"ד)',
		minValue: 10,
		description: 'adds more than 10 units of housing'
	}
	
}