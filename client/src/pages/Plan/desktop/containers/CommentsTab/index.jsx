import React from 'react';
import PropTypes from 'prop-types';
import { CommentView } from 'pages/Plan/common';
import { CommentForm } from './components';
import t from 'locale/he_IL';
import { CommentSelectors } from 'redux/selectors';
import * as SC from './style';

const CommentsTab = ({
	setRefetchComments,
	tabValue,
	isNewCommentOpen,
	newCommentViewHandler,
	closeNewCommentView,
	newCommentText, handleNewCommentText }) => {
	const { comments } = CommentSelectors();

	return (
		<>
			<CommentForm
				setRefetchComments={setRefetchComments}
				tabValue={tabValue}
				comments={comments.length}
				isNewCommentOpen={isNewCommentOpen}
				closeNewCommentView={closeNewCommentView}
				newCommentViewHandler={newCommentViewHandler}
				newCommentText={newCommentText}
				handleNewCommentText={handleNewCommentText}
			/>
			{comments.length > 0 &&
							<>
								{comments.map((comment, index) => (
									<CommentView
										setRefetchComments={setRefetchComments}
										key={index}
										id={index}
										tabValue={tabValue}
										commentData={comment}
										isNewCommentOpen={isNewCommentOpen}
									/>
								))}
							</>
			}
			{comments.length === 0 && !isNewCommentOpen &&
							<SC.NoComments>
								<SC.NoCommentsBold>{t.startDiscussion}</SC.NoCommentsBold>
								<br/>
								<SC.NoCommentsRegular>{t.shareThought}</SC.NoCommentsRegular>
							</SC.NoComments>
	 					}
		</>
	);
};

CommentsTab.propTypes = {
	tabValue: PropTypes.any.isRequired,
	newCommentViewHandler: PropTypes.func.isRequired,
	closeNewCommentView: PropTypes.func.isRequired,
	isNewCommentOpen: PropTypes.bool.isRequired,
	newCommentText: PropTypes.string,
	handleNewCommentText: PropTypes.func.isRequired,
	setRefetchComments: PropTypes.func.isRequired,
};

export default CommentsTab;