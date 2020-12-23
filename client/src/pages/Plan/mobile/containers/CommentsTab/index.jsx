import React from 'react';
import PropTypes from 'prop-types';
import { CommentView } from 'pages/Plan/common';
import { CommentForm } from './components';
import t from 'locale/he_IL';
import { CommentSelectors } from 'redux/selectors';
import * as SC from '../../style';

const CommentsTab = ({ 
	tabValue,
	setRefetchComments,
	isNewCommentOpen,
	newCommentViewHandler,
	closeNewCommentView,
	commentTypes,
	newCommentText, handleNewCommentText,
	newCommentType,handleNewCommentType }) => {
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
				commentTypes={commentTypes}
				newCommentText={newCommentText}
				handleNewCommentText={handleNewCommentText}
				newCommentType={newCommentType}
				handleNewCommentType={handleNewCommentType}
			/>
			{comments.length > 0 && !isNewCommentOpen &&
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
	commentTypes: PropTypes.array.isRequired,
	newCommentText: PropTypes.string,
	handleNewCommentText: PropTypes.func.isRequired,
	newCommentType: PropTypes.string,
	handleNewCommentType: PropTypes.func.isRequired,
	setRefetchComments: PropTypes.func.isRequired
};

export default CommentsTab;