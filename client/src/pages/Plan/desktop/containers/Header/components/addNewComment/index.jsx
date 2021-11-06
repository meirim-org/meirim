import { Button } from '@material-ui/core';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { useTheme } from '@material-ui/styles';
import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Text } from 'shared';

const AddNewComment = ({ newCommentViewHandler  }) => {
	const { id: planId } = useParams();
	const history = useHistory();
	const theme = useTheme();
	const { t } = useTranslation();
	
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