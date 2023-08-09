import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'shared';
import * as SC from './style';
import { useTheme } from '@material-ui/styles';
import { daysPassed } from 'pages/Plan/utils';
import {
	HeaderAvatarBox,
	HeaderCommentDate,
	HeaderPersonVerified,
} from './style';
import defaultAvatar from '../../../../assets/svg/defaultAvatar.svg';
import clockIcon from '../../../../assets/icons/clock.svg';
import arrowReplyIcon from '../../../../assets/icons/arrow-reply.svg';
import verifiedIcon from '../../../../assets/icons/verified.svg';

const SubCommentView = ({ subCommentData }) => {
	const theme = useTheme();
	const {
		content,
		created_at,
		person: { name, status, type: personType, url },
	} = subCommentData;

	return (
		<>
			<SC.SubCommentBox>
				<SC.SubCommentHeader>
					<HeaderAvatarBox>
						<img src={arrowReplyIcon} alt="Arrow Reply Icon" />
						<div className="UserAvatar">
							<img
								src={
									url && status === '1' ? url : defaultAvatar
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
										right={'23px'}
										src={verifiedIcon}
										alt="Person verified"
									/>
								</>
							)}
						</Typography>
					</HeaderAvatarBox>
					<HeaderCommentDate>
						<img src={clockIcon} alt="date icon" />
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
					</HeaderCommentDate>
				</SC.SubCommentHeader>
				<Typography
					variant="paragraphTextLight"
					mobileVariant="paragraphTextLight"
					component="p"
					color={theme.palette.black}
				>
					{content}
				</Typography>
			</SC.SubCommentBox>
		</>
	);
};

SubCommentView.propTypes = {
	subCommentData: PropTypes.object.isRequired,
};

export default SubCommentView;
