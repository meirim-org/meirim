import React from 'react';
import PropTypes from 'prop-types';
import { CommentSelectors } from 'redux/selectors';
import { SavePlan, SharePlan, Tabs, Title, AddNewComment } from './components';
import * as SC from './style';

const Header = ({ countyName, name, tabValue, handleTabChange, openNewCommentView }) => {
	const { comments } = CommentSelectors();
	const	numberOfComments = comments.length.toString();
	
	return (
		<SC.Header>
			<SC.TitlesAndTabs>
				<Title countyName={countyName} planName={name}/>
				<SC.AppBar position="static">
					<Tabs tabValue={tabValue} handleTabChange={handleTabChange} numberOfComments={numberOfComments} />
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
	name: PropTypes.string,
	countyName: PropTypes.string,
	tabValue: PropTypes.any.isRequired,
	handleTabChange: PropTypes.func.isRequired,
	openNewCommentView: PropTypes.func.isRequired,
};

export default Header;