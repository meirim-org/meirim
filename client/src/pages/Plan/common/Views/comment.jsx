import { useTheme } from '@material-ui/styles';
import { useTranslation } from 'locale/he_IL';
import { daysPassed } from 'pages/Plan/utils';
import PropTypes from 'prop-types';
import React from 'react';
import { TabBox, TabPanel, Typography } from 'shared';
import * as SC from './style';

const CommentView = ({ commentData, isNewCommentOpen, children }) => {
	const theme = useTheme();
	const { content, created_at, person: { name }, type } = commentData;
	const { t } = useTranslation();

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
							{created_at ? daysPassed(created_at) : ' הרבה '}
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
				{children}
			</TabBox>
		</TabPanel>
	);
};

CommentView.defaultProps = {
	isNewCommentOpen: false
};

CommentView.propTypes = {
	commentData: PropTypes.object.isRequired,
	isNewCommentOpen: PropTypes.bool.isRequired,
	children: PropTypes.any
};

export default CommentView;