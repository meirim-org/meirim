import React from 'react';
import PropTypes from 'prop-types';
import { PlanSelectors, CommentSelectors } from 'redux/selectors';
import { SavePlan, SharePlan, Tabs, Title, AddNewComment } from './components';
import * as SC from './style';

const Header = ({ handleTabChange, openNewCommentView, ...props }) => {
	console.log('🚀 ~ file: index.jsx ~ line 29 ~ Header ~ props', props);
	const { planData } = PlanSelectors();
	const { comments } = CommentSelectors();
	const	numberOfComments = comments.length.toString();
	const { name, countyName } = planData;
	
	return (
		<SC.Header>
			<SC.TitlesAndTabs>
				<Title countyName={countyName} planName={name}/>
				<SC.AppBar position="static">
					<Tabs handleTabChange={handleTabChange} numberOfComments={numberOfComments} {...props} />
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
};

export default Header;