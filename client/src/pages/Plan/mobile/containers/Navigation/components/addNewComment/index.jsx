import { BottomNavigationAction } from '@material-ui/core';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

const AddNewComment = ({ newCommentViewHandler }) => {
	const { id: planId } = useParams();
	const history = useHistory();
	const { t } = useTranslation();
	return (
		<BottomNavigationAction
			onClick={()=> {
				history.push(`/plan/${planId}/comments`);
				newCommentViewHandler();
			}}
			label={t.addNewComment}
			icon={<ChatBubbleOutlineIcon
				fontSize={'small'} />} />
	);
};

AddNewComment.propTypes = {
	newCommentViewHandler: PropTypes.func.isRequired,
};

export default AddNewComment;