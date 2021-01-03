import React from 'react';
import * as SC from './style';
import { AddNewComment, SavePlan, SharePlan } from './components';
import PropTypes from 'prop-types';

const Navigation = ({ openNewCommentView }) => {

	return (
		<SC.Navigation>
			<SharePlan />
			<AddNewComment openNewCommentView={openNewCommentView}/>
			<SavePlan />
		</SC.Navigation>
	);
};

Navigation.propTypes = {
	openNewCommentView: PropTypes.func.isRequired,
};

export default Navigation;

