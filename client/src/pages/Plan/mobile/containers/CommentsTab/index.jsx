import React from 'react';
import PropTypes from 'prop-types';
import { CommentForm, CommentView,  SubCommentForm, SubCommentView } from 'pages/Plan/common';
import t from 'locale/he_IL';
import { CommentSelectors } from 'redux/selectors';
import * as SC from 'pages/Plan/mobile/style';
import { TabPanel, Button } from 'shared';
import { Badge, useTheme } from '@material-ui/core';

const CommentsTab = ({ addNewComment, addSubComment, addLikeToComment, commentState, subCommentState, setCommentState, setSubCommentState }) => {
	const theme = useTheme();
	const { comments } = CommentSelectors();
	const isNewCommentOpen = commentState.isOpen;
	const { isOpen: isCommentOpen } = commentState;
	const { isOpen: isSubCommentOpen } = subCommentState;

	return (
		<>
			{isCommentOpen && <CommentForm
				addNewComment={addNewComment}
				comments={comments.length}
				commentState={commentState}
				setCommentState={setCommentState}
			/>}
			{comments.length > 0 && !isNewCommentOpen &&
                <>
                	{comments.map((comment) => {
                		const { id: commentId, likes } = comment;
                		return (
                			<>
                				<CommentView
                					commentData={comment}
                					isNewCommentOpen={commentState.isOpen}
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
                					<SC.AddSubComment className={isSubCommentOpen ? 'active' : ''}>
                						<Button
                							id={'add-response-' + comment.id}
                							textcolor={theme.palette.black}
                							text={t.addAResponse}
                							onClick={() => setSubCommentState(pv => ({ ...pv, isOpen: !subCommentState.isOpen }))}
                							simple
                							iconBefore={<SC.CommentIcon/>}
                						/>
                					</SC.AddSubComment>
                					<SC.CommentsWrapper>
                						{isSubCommentOpen &&
                                    <SubCommentForm
                                    	addSubComment={addSubComment}
                                    	parentComment={comment}
                                    	subCommentState={subCommentState}
                                    	setSubCommentState={setSubCommentState}
                                    />
                						}
                						{comment.subComments &&
                                    comment.subComments.map((subComment, index) => (
                                    	<SubCommentView key={index} id={index} subCommentData={subComment}/>
                                    ))}
                					</SC.CommentsWrapper>
                				</CommentView>
                			</>
                		);
                	})}
                </>
			}
			{comments.length === 0 && !isNewCommentOpen &&
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
	commentState: PropTypes.object.isRequired,
	subCommentState: PropTypes.object.isRequired,
	setSubCommentState: PropTypes.func.isRequired,
	setCommentState: PropTypes.func.isRequired,
	addLikeToComment: PropTypes.func.isRequired,
	addComment: PropTypes.func.isRequired,
	addSubComment: PropTypes.func.isRequired,
};

export default CommentsTab;