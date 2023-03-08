import { useState, useEffect } from 'react';
import Table from 'components/Table/Table';
import Wrapper from 'components/Wrapper';
import React from 'react';
import { useTranslation } from 'locale/he_IL';
import api from 'services/api';
import * as SC from './style'
import { Text } from 'shared';
import { Link } from 'react-router-dom';
import usePermitTableColumns from './usePermitTableColumns';
import { CheckIfUserCanAccessPage } from 'hooks';

const Permits = () => {
	//CheckIfUserCanAccessPage();

	const { t } = useTranslation();
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchData = () => {
			setLoading(true)
			return api.get('/permit')
				.then(result => {
					setData(result.data);
				}).finally(
					setLoading(false)
				)
		}
		fetchData();
	}, []);

	const columns = usePermitTableColumns()

	return (
		<Wrapper>
			<SC.PageWrapper>
				{loading
					? <SC.NoContent>
						<Text
							size="1.5rem"
							text={t.loading}
							component="p"
						/>
					</SC.NoContent>
					: data?.length
						? <Table columns={columns} data={data} defaultSorting="permitSubject" />
						: <SC.NoContent>
							<Text
								size="1.5rem"
								text={t.noAOISavedTitle}
								component="p"
							/>
							<Link to="/permits/aoi/">{t.addAOILinkTitle}</Link>
						</SC.NoContent>}
			</SC.PageWrapper>
		</Wrapper>
	);
};

export default Permits;