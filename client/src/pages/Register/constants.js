import { useTranslation } from "locale/he_IL";

export const usePersonTypes = () => { 
	const { t } = useTranslation();

	return ([
		{
			value: '0',
			text: t.takeAction,
		},
		{
			value: '1',
			text: 'חבר מועצה/ ועדת תכנון',
		},
		{
			value: '2',
			text: 'אדריכל/מתכנן/בעל מקצוע בתחום התכנון והבניה',
		},
		{
			value: '3',
			text: 'שמאי/רו״ח/עו״ד בתחום התכנון והבניה',
		},
		{
			value: '4',
			text: 'פעיל בארגון ללא מטרות רווח',
		},
		{
			value: '5',
			text: 'יזם',
		},
		{
			value: '6',
			text: 'אחר',
		},
	]);
 };
