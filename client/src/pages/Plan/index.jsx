import React from 'react';
import { useParams } from 'react-router-dom';
import Wrapper from 'components/Wrapper';
import { Header, GoalsPanel, StatusTypeUrlPanel, StatsPanel } from './components';
import { useDataHandler } from './hooks';
import * as SC from './style';

const Plan = () => {
	const [tabValue, setValue] = React.useState(0);
	const handleTabChange = (_, newValue) => setValue(newValue);
	const { id: planId } = useParams();
	const { planData, dataArea, textArea } = useDataHandler(planId);
	
	return (
	    <Wrapper>
			<SC.MainWrapper>
				<SC.Content>
					<Header 
						tablValue={tabValue} handleTabChange={handleTabChange} 
						name={planData.name} countyName={planData.countyName} />
					<SC.Main>
						<StatusTypeUrlPanel 
							tabValue={tabValue} type={planData.type} 
							status={planData.status} url={planData.url} />
						<GoalsPanel goalsFromMavat={planData.goalsFromMavat} tabValue={tabValue} />
						<StatsPanel tabValue={tabValue} dataArea={dataArea} textArea={textArea} />
					</SC.Main>
				</SC.Content>
				<div>map</div>
			</SC.MainWrapper>
		</Wrapper>
	);
};

export default Plan;