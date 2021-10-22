import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'shared';
import * as SC from './style';

const AddComment = ({ isNewCommentOpen, newCommentViewHandler }) => {
	const { t } = useTranslation();

	return (
		<Button
			id="add-opinion"
			text={t.addNewComment}
			iconBefore={<SC.CommentIcon/>}
			small
			altColor
			active={isNewCommentOpen}
			onClick={newCommentViewHandler}
		/>
	);
};

AddComment.propTypes = {
	isNewCommentOpen: PropTypes.bool,
	newCommentViewHandler: PropTypes.func.isRequired,
};

export default AddComment;