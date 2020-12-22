import React from 'react';
import * as SC from './style';
import { AddNewComment, SavePlan, SharePlan } from './components';
import PropTypes from 'prop-types';

const Navigation = ({ handleTabChange, openNewCommentView }) => {

	return (
		<SC.Navigation>
			<SharePlan />
			<AddNewComment handleTabChange={handleTabChange} openNewCommentView={openNewCommentView}/>
			<SavePlan />
		</SC.Navigation>
	);
};

Navigation.propTypes = {
	handleTabChange: PropTypes.func.isRequired,
	openNewCommentView: PropTypes.func.isRequired,
};

export default Navigation;

