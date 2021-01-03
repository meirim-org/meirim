import React from 'react';
import PropTypes from 'prop-types';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { BottomNavigationAction } from '@material-ui/core';
import t from 'locale/he_IL';
// import { useHistory } from 'react-router-dom';

const AddNewComment = ({ openNewCommentView }) => {
	// const history = useHistory();
	
	return (
		<BottomNavigationAction
			onClick={()=> {
				// history.push
				openNewCommentView();

			}}
			label={t.addNewComment}
			icon={<ChatBubbleOutlineIcon
				fontSize={'small'} />} />
	);
};

AddNewComment.propTypes = {
	openNewCommentView: PropTypes.func.isRequired,
};

export default AddNewComment;