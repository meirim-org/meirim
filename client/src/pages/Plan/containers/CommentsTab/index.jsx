import React from 'react';
import { useTheme } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { openModal } from 'redux/modal/slice';
import t from 'locale/he_IL';
import {  TabPanel, Button } from 'shared';
import { CommentForm, CommentView,  SubCommentForm, SubCommentView, AddComment } from 'pages/Plan/common';
import { CommentSelectors, UserSelectors } from 'redux/selectors';
import { Badge } from '@material-ui/core';
import * as SC from './style';
import { useDispatch } from 'react-redux';

const CommentsTab = ({
	commentState,
	subCommentState,
	setCommentState,
	setSubCommentState,
	addNewComment,
	addSubComment,
	addLikeToComment,
	 }) => {
	const dispatch = useDispatch();
	const { isAuthenticated } = UserSelectors();
	const { comments } = CommentSelectors();
	const { isOpen: isSubCommentOpen } = subCommentState;
	const { isOpen: isCommentOpen } = commentState;
	const theme = useTheme();
	const showComments = comments.length > 0; 
	const showStartDiscussionPanel = comments.length === 0 && !isCommentOpen;
	const newCommentViewHandler = () =>{ 
		if (isAuthenticated){
			setCommentState(pv => ({ ...pv, isOpen: !isCommentOpen }));
		} else {
			dispatch(openModal({ modalType: 'login' }));
		}
	};
	
	return (
		<>			
			<SC.ButtonWrapper>
				<AddComment isNewCommentOpen={isCommentOpen} newCommentViewHandler={newCommentViewHandler}/>
			</SC.ButtonWrapper>
			{isCommentOpen && <CommentForm
				addNewComment={addNewComment}
				comments={comments.length}
				commentState={commentState}
				setCommentState={setCommentState}
			/>}
			{showComments && comments.map((comment, index) => {
				const { id: commentId, likes } = comment;

				return ( 
					<div key={'add-subcomment-form' + comment.id}>
						<CommentView
							key={index}
							addLikeToComment={addLikeToComment}
							commentData={comment}
							isNewCommentOpen={isCommentOpen}
						>
							<SC.Like>
								<Button
									id={'like-' + commentId}
									textcolor={theme.palette.black}
									text={t.iLike}
									onClick={() => addLikeToComment(commentId)}
									simple
									iconBefore={<SC.LikeIcon/>}
								/>
								<Badge
									badgeContent={!likes ? 0 : likes}
								/>
							</SC.Like>
							<SubCommentForm
								id={'add-subcomment-form' + comment.id}
								key={'add-subcomment-form' + comment.id}
								isSubCommentOpen={isSubCommentOpen}
								addSubComment={addSubComment}
								parentComment={comment}
								subCommentState={subCommentState}
								setSubCommentState={setSubCommentState}
							/>

							<SC.CommentsWrapper>
								{comment.subComments &&
                                comment.subComments.map((subComment, index) => (
                                	<SubCommentView key={index} id={index} subCommentData={subComment}/>
                                ))}
							</SC.CommentsWrapper>
						</CommentView>
					</div>
				);
			})
			}
			{showStartDiscussionPanel &&
            <TabPanel>
            		<SC.NoComments>
            		<SC.NoCommentsBold>{t.startDiscussion}</SC.NoCommentsBold>
            		<br/>
            		<SC.NoCommentsRegular>{t.shareThought}</SC.NoCommentsRegular>
            		</SC.NoComments>
            </TabPanel>
			}
		</>
	);
};

CommentsTab.propTypes = {
	commentState:  PropTypes.object.isRequired,
	subCommentState: PropTypes.object.isRequired,
	setCommentState: PropTypes.func.isRequired,
	setSubCommentState: PropTypes.func.isRequired,
	addNewComment: PropTypes.func.isRequired,
	addSubComment: PropTypes.func.isRequired,
	addLikeToComment: PropTypes.func.isRequired,
};

export default CommentsTab;