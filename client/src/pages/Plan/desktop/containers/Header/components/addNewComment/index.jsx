import React from 'react';
import PropTypes from 'prop-types';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { Button } from '@material-ui/core';
import { Text } from 'shared';
import t from 'locale/he_IL';
import { useHistory, useParams } from 'react-router-dom';
import { colors } from 'style';

const AddNewComment = ({ newCommentViewHandler  }) => {
	const { id: planId } = useParams();
	const history = useHistory();
	
	return (
		<Button
			variant="contained"
			color="primary"
			onClick={()=> {
				history.push(`/plan/${planId}/comments`);
				newCommentViewHandler();
			}}
			startIcon={<ChatBubbleOutlineIcon />}
		>
			<Text size="14px" text={t.addNewComment} component="span" color={colors.grey[800]}/>
		</Button>	
	);
};

AddNewComment.propTypes = {
	newCommentViewHandler: PropTypes.func.isRequired,
};

export default AddNewComment;