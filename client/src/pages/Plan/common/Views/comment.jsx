import React from 'react';
import PropTypes from 'prop-types';
import { TabPanel, TabBox, Typography,  Button } from 'shared';
import t from 'locale/he_IL';
import { useTheme } from '@material-ui/styles';
import { Badge } from '@material-ui/core';
import { daysPassed } from 'pages/Plan/utils';
import * as SC from './style';

export const CommentView = ({ addLikeToComment, commentData, isNewCommentOpen }) => {
	const theme = useTheme();
	const { content, created_at, person: { name }, id: commentId, likes, type } = commentData;

	return (
		<TabPanel>
			<TabBox isComment={true} disabled={isNewCommentOpen}>
				<SC.Header>
					<SC.FirstSide>
						<Typography
							variant="menuTitle"
							mobileVariant="menuTitle"
							component="span"
							color={theme.palette.green['text2']}
						>
							{t[type]}
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
						onClick={() => addLikeToComment({ commentId })}
						simple
						iconBefore={<SC.LikeIcon/>}
					/>
					<Badge
						badgeContent={!likes ? 0 : likes}
					/>
				</SC.Like>
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
	addLikeToComment: PropTypes.func.isRequired,
};

export default CommentView;