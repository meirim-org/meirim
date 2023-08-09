import { useTheme } from '@material-ui/styles';
import { useTranslation } from 'locale/he_IL';
import { daysPassed } from 'pages/Plan/utils';
import PropTypes from 'prop-types';
import React from 'react';
import { TabBox, TabPanel, Typography } from 'shared';
import * as SC from './style';
import defaultAvatar from '../../../../assets/svg/defaultAvatar.svg';
import clockIcon from '../../../../assets/icons/clock.svg';
import verifiedIcon from '../../../../assets/icons/verified.svg';
import {
	HeaderAvatarBox,
	HeaderPersonType,
	HeaderPersonVerified,
	HeaderTypeCommentBox,
} from './style';

const CommentView = ({ commentData, isNewCommentOpen, children }) => {
	const theme = useTheme();
	const {
		content,
		created_at,
		person: { name, type: personType, status, url },
		type,
	} = commentData;
	console.log({ commentData });
	const { t } = useTranslation();

	return (
		<TabPanel>
			<TabBox isComment={true} disabled={isNewCommentOpen}>
				<SC.HeaderComment>
					<SC.HeaderCommentContent>
						<HeaderTypeCommentBox>
							<Typography
								variant="menuTitle"
								mobileVariant="menuTitle"
								component="span"
								color={theme.palette.green['text2']}
							>
								{t[type]}
							</Typography>
						</HeaderTypeCommentBox>
						<HeaderAvatarBox>
							<div className="UserAvatar">
								<img
									src={
										url && status === '1'
											? url
											: defaultAvatar
									}
									alt={`Avatar ${name}`}
								/>
							</div>
							<Typography
								variant="highlightedText"
								mobileVariant="highlightedText"
								component="span"
								color={theme.palette.black}
							>
								<span className="UserName">{name}</span>
								{status === '1' && (
									<>
										<div className="HeaderPersonType">
											{personType}
										</div>
										<HeaderPersonVerified
											src={verifiedIcon}
											alt="Person verified"
										/>
									</>
								)}
							</Typography>
						</HeaderAvatarBox>
					</SC.HeaderCommentContent>
					<SC.SecondSide>
						<img src={clockIcon} alt="date icon" />
						<Typography
							variant="light"
							mobileVariant="light"
							component="span"
							color={theme.palette.gray['600']}
						>
                            לפני
							{created_at ? daysPassed(created_at) : ' הרבה '}
                            ימים
						</Typography>
					</SC.SecondSide>
				</SC.HeaderComment>
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
	isNewCommentOpen: false,
};

CommentView.propTypes = {
	commentData: PropTypes.object.isRequired,
	isNewCommentOpen: PropTypes.bool.isRequired,
	children: PropTypes.any,
};

export default CommentView;
