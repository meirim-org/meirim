import Table from 'components/Table/Table';
import Wrapper from 'components/Wrapper';
import React from 'react';
import { createColumnHelper } from '@tanstack/react-table'
import { useTranslation } from 'locale/he_IL';

const Homepage = () => {
	const { t } = useTranslation();

	const data = [
		{
			permitId: 1,
			permitSubject: 'בנייה חדשה א',
			permitCreatedAt: '23/11/2022',
			permitRegion: 'גזר',
			permitRealEstate: 'גוש: 4628, חלקה: 16',
			permitAuthor: 'חברת חשמל לישראל בע״מ',
			permitStatus: 'פתיחה',
			permitTimeline: '31 יום',
			permitImportance: 'לא מעניין',
		},
		{
			permitId: 2,
			permitSubject: 'בנייה חדשה ב',
			permitCreatedAt: '23/11/2022',
			permitRegion: 'גזר',
			permitRealEstate: 'גוש: 4628, חלקה: 16',
			permitAuthor: 'חברת חשמל לישראל בע״מ',
			permitStatus: 'פתיחה',
			permitTimeline: '31 יום',
			permitImportance: 'לא מעניין',
		},
		{
			permitId: 3,
			permitSubject: 'בנייה חדשה ג',
			permitCreatedAt: '23/11/2022',
			permitRegion: 'גזר',
			permitRealEstate: 'גוש: 4628, חלקה: 16',
			permitAuthor: 'חברת חשמל לישראל בע״מ',
			permitStatus: 'פתיחה',
			permitTimeline: '31 יום',
			permitImportance: 'מעניין',
		},
	]

	const columnHelper = createColumnHelper()

	const columns = [
		columnHelper.accessor('permitSubject', {
			header: () => t.permitSubject
		}),
		columnHelper.accessor('permitCreatedAt', {
			header: () => t.permitCreatedAt
		}),
		columnHelper.accessor('permitRegion', {
			header: () => t.permitRegion
		}),
		columnHelper.accessor('permitRealEstate', {
			header: () => t.permitRealEstate
		}),
		columnHelper.accessor('permitAuthor', {
			header: () => t.permitAuthor
		}),
		columnHelper.accessor('permitStatus', {
			header: () => t.permitStatus
		}),
		columnHelper.accessor('permitTimeline', {
			header: () => t.permitTimeline
		}),
		columnHelper.accessor('permitImportance', {
			header: () => t.permitImportance
		}),
	]

	return (
		<Wrapper>
			<Table columns={columns} data={data} />
		</Wrapper>
	);
};

export default Homepage;