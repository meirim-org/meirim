import React from 'react';
import PropTypes from 'prop-types';
import Wrapper from 'components/Wrapper';
import { Header, GoalsPanel, StatusTypeUrlPanel, StatsPanel, CommentPanel } from '../components';
import * as SC from '../style';

const PlanDesktop = ({ tabValue, handleTabChange, planData, dataArea, textArea, commentsData }) => {
	const { name, countyName, type, status, url, goalsFromMavat } = planData;
	
	return (
	    <Wrapper>
			<SC.MainWrapper>
				<SC.Content>
					<Header 
						tablValue={tabValue} handleTabChange={handleTabChange} 
						name={name} countyName={countyName} />
					<SC.Main>
						<StatusTypeUrlPanel 
							tabValue={tabValue} type={type} 
							status={status} url={url} />
						<GoalsPanel goalsFromMavat={goalsFromMavat} tabValue={tabValue} />
						<StatsPanel tabValue={tabValue} dataArea={dataArea} textArea={textArea} />

						{commentsData.map((comment, index) => (
							<CommentPanel key={index} tabValue={tabValue} commentData={comment} /> 
						))}

					</SC.Main>
				</SC.Content>
				<div>map</div>
			</SC.MainWrapper>
		</Wrapper>
	);
};

PlanDesktop.propTypes = {
	planData: PropTypes.object.isRequired,
	tabValue: PropTypes.string.isRequired,
	dataArea: PropTypes.array.isRequired,
	commentsData: PropTypes.array.isRequired,
	handleTabChange: PropTypes.func.isRequired,
	textArea: PropTypes.object.isRequired,
};

export default PlanDesktop;