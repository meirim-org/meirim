import React from 'react';
import PropTypes from 'prop-types';
import { PlanSelectors } from 'redux/selectors';
import { SavePlan, SharePlan, Tabs, Title, AddNewComment } from './components';
import * as SC from './style';

const Header = ({ handleTabChange, openNewCommentView, commentsCount }) => {
	const { planData } = PlanSelectors();
	const { name, countyName } = planData;
	
	return (
		<SC.Header>
			<SC.TitlesAndTabs>
				<Title countyName={countyName} planName={name}/>
				<SC.AppBar position="static">
					<Tabs handleTabChange={handleTabChange} commentsCount={commentsCount} />
				</SC.AppBar>
			</SC.TitlesAndTabs>
			<SC.Buttons>
				<SharePlan />
				<SavePlan />
				<AddNewComment handleTabChange={handleTabChange} openNewCommentView={openNewCommentView}/>
			</SC.Buttons>
		</SC.Header>
	);
};

Header.propTypes = {
	handleTabChange: PropTypes.func.isRequired,
	openNewCommentView: PropTypes.func.isRequired,
	commentsCount: PropTypes.string.isRequired,
};

export default Header;