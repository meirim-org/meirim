import React from 'react';
import * as SC from './style';
import { AddNewComment, SavePlan, SharePlan } from './components';
import PropTypes from 'prop-types';

const Navigation = ( { newCommentViewHandler } ) => {

	return (
		<SC.Navigation>
			<SharePlan />
			<AddNewComment newCommentViewHandler={newCommentViewHandler}/>
			<SavePlan />
		</SC.Navigation>
	);
};

Navigation.propTypes = {
	newCommentViewHandler: PropTypes.func.isRequired,
};

export default Navigation;

