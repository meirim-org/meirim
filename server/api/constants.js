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

exports.tagDataRules = 
[
	{
	tagId: 1,
	tagName: 'דיור',
	rules: [
		 {
			usage: 'מגורים (מ"ר)' ,
			minValue: 1000,
			description: 'adds more than 1,000 Sq Meters of housing'
		},
		 {
			usage: 'מגורים (יח"ד)',
			minValue: 10,
			description: 'adds more than 10 units of housing'
		}]
	},
	{ 
	tagId: 3,
	tagName: 'מבני ציבור',
	rules: [
		{
			usage: 'מבני ציבור (מ"ר)' ,
			minValue: 50,
			description: 'adds more than 50 Sq Meters of public area'
		}]
}

]
	
	
	
