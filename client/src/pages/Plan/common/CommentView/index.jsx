import React from 'react';
import PropTypes from 'prop-types';
import { TabPanel, TabBox, Typography,  Button } from 'shared';
import t from 'locale/he_IL';
import { useTheme } from '@material-ui/styles';
import { Badge } from '@material-ui/core';
import { addLike } from 'pages/Plan/controller';
import { SubCommentForm, SubCommentView } from 'pages/Plan/common';
import { daysPassed } from '../../utils';
import * as SC from './style';

export const CommentView = ({ setRefetchComments, id, tabValue, commentData, isNewCommentOpen }) => {
	console.log('🚀 ~ file: index.jsx ~ line 111 ~ CommentView ~ commentData', commentData);
	const theme = useTheme();
	const [newSubComment, setNewSubComment] = React.useState(false);
	const { content, created_at, person: { name }, id: commentId, likes } = commentData;
	
	const closeNewSubCommentView = () => setNewSubComment(false);

	return (
		<TabPanel value={tabValue} index={1} >
			<TabBox isComment={true} disabled={isNewCommentOpen}>
				<SC.Header>
					<SC.FirstSide>
						<Typography
							variant="menuTitle"
							mobileVariant="menuTitle"
							component="span"
							color={theme.palette.green['text2']}
						>
							ביקורת
						</Typography>
						<Typography
							variant="highlightedText"
							mobileVariant="highlightedText"
							component="span"
							color={theme.palette.black}
						>
							{name}
						</Typography>
					</SC.FirstSide>
					<SC.SecondSide>
						<Typography
							variant="light"
							mobileVariant="light"
							component="span"
							color={theme.palette.gray['main']}
						>
	                    לפני
							{daysPassed(created_at)}
	                    ימים
						</Typography>
					</SC.SecondSide>
				</SC.Header>
				<SC.Text>
					<Typography
						variant="paragraphText"
						mobileVariant="paragraphText"
						component="p"
						color={theme.palette.black}
					>
						{content}
					</Typography>
				</SC.Text>
				<SC.Like>
					<Button
						id={'like-' + commentId}
						textcolor={theme.palette.black}
						text={t.iLike}
						onClick={async () => {
							await addLike({ commentId });
							setRefetchComments();
						}}
						simple
						iconBefore={<SC.LikeIcon/>}
					/>
					<Badge
						badgeContent={!likes ? 0 : likes}
					/>
				</SC.Like>
				<SC.AddSubComment className={newSubComment ? 'active' : ''}>
					<Button
						id={'add-response-' + commentId}
						textcolor={theme.palette.black}
						text={t.addAResponse}
						onClick={() => setNewSubComment(!newSubComment)}
						simple
						iconBefore={<SC.CommentIcon/>}
					/>
				</SC.AddSubComment>
				<SC.CommentsWrapper>
					{newSubComment &&
						<SubCommentForm 
							setRefetchComments={setRefetchComments}
							parentComment={commentData}
							newSubComment={newSubComment} 
							closeNewSubCommentView={closeNewSubCommentView}  />
					}
					{commentData.subComments &&
					<>
						{commentData.subComments.map((subComment, index) => (
							<SubCommentView key={index} id={index} subCommentData={subComment} />
						))}
					</>
					}
				</SC.CommentsWrapper>

			</TabBox>
		</TabPanel>
	);
};

CommentView.defaultProps = {
	isNewCommentOpen: false
};

CommentView.propTypes = {
	id: PropTypes.number.isRequired,
	commentData: PropTypes.object.isRequired,
	isNewCommentOpen: PropTypes.bool.isRequired,
	setRefetchComments: PropTypes.func.isRequired,
	tabValue: PropTypes.any.isRequired,
};

export default CommentView;