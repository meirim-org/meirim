import React from 'react';
import PropTypes from 'prop-types';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { BottomNavigationAction } from '@material-ui/core';
import t from 'locale/he_IL';

const AddNewComment = ({ handleTabChange, openNewCommentView }) => {
	return (
		<BottomNavigationAction
			onClick={()=> {
				handleTabChange(null,1);
				openNewCommentView();
			}}
			label={t.addNewComment}
			icon={<ChatBubbleOutlineIcon
				fontSize={'small'} />} />
	);
};

AddNewComment.propTypes = {
	handleTabChange: PropTypes.func.isRequired,
	openNewCommentView: PropTypes.func.isRequired,
};

export default AddNewComment;