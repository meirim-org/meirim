import React from 'react';
import { useTheme } from '@material-ui/styles';
import PropTypes from 'prop-types';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { Button } from '@material-ui/core';
import { Text } from 'shared';
import t from 'locale/he_IL';
import { useHistory, useParams } from 'react-router-dom';

const AddNewComment = ({ newCommentViewHandler  }) => {
	const { id: planId } = useParams();
	const history = useHistory();
	const theme = useTheme();
	
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
			<Text size="14px" text={t.addNewComment} component="span" color={theme.palette.gray['800']}/>
		</Button>	
	);
};

AddNewComment.propTypes = {
	newCommentViewHandler: PropTypes.func.isRequired,
};

export default AddNewComment;