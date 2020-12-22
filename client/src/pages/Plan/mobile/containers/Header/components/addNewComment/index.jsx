import React from 'react';
import { useTheme } from '@material-ui/styles';
import PropTypes from 'prop-types';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { Button } from '@material-ui/core';
import { Text } from 'shared';
import t from 'locale/he_IL';

const AddNewComment = ({ handleTabChange, openNewCommentView }) => {
	const theme = useTheme();
	
	return (
		<Button
			variant="contained"
			color="primary"
			onClick={()=> {
				handleTabChange(null,1); 
				openNewCommentView();
			}}
			startIcon={<ChatBubbleOutlineIcon />}
		>
			<Text size="14px" text={t.addNewComment} component="span" color={theme.palette.gray['800']}/>
		</Button>	
	);
};

AddNewComment.propTypes = {
	handleTabChange: PropTypes.func.isRequired,
	openNewCommentView: PropTypes.func.isRequired,
};

export default AddNewComment;