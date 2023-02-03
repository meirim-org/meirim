import { useState, useEffect } from 'react';
import Table from 'components/Table/Table';
import Wrapper from 'components/Wrapper';
import React from 'react';
import { createColumnHelper } from '@tanstack/react-table'
import { useTranslation } from 'locale/he_IL';
import { CheckIfUserCanAccessPage } from 'hooks';
import api from 'services/api';

const Permits = () => {
	CheckIfUserCanAccessPage();

	const { t } = useTranslation();
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchData = () => {
			return api.get('/permit')
				.then(result => {
					setData(result.data);
				})
		}
		fetchData();
	}, []);

	const columnHelper = createColumnHelper()

	const columns = [
		columnHelper.accessor('permitSubject', {
			header: () => t.permitSubject
		}),
		columnHelper.accessor('permitPermitCreatedAt', {
			header: () => t.permitPermitCreatedAt,
			cell: (context) => new Date(context.getValue()).toLocaleDateString()
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

export default Permits;