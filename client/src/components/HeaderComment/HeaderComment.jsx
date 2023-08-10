import { Typography } from '../../shared';
import { openModal } from '../../redux/modal/slice';
import { daysPassed } from '../../pages/Plan/utils';
import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/styles';
import { useTranslation } from '../../locale/he_IL';
import { useDispatch } from 'react-redux';
import verifiedIcon from '../../assets/icons/verified.svg';
import clockIcon from '../../assets/icons/clock.svg';
import arrowReplyIcon from '../../assets/icons/arrow-reply.svg';
import {
	HeaderAvatarBox,
	HeaderCommentBox,
	HeaderCommentContent,
	HeaderCommentDate,
	HeaderPersonVerified,
	HeaderTypeCommentBox,
} from './style';
import VerifiedTooltip from '../VerifiedTooltip/VerifiedTooltip';
import { defaultAvatars } from '../../assets/avatars/defaultAvatars';

const HeaderComment = (data) => {
	const theme = useTheme();
	const { name, type, status, url, created_at, title, mode, personId } = data;
	const { t } = useTranslation();
	const dispatch = useDispatch();

	return (
		<HeaderCommentBox mode={mode}>
			<HeaderCommentContent>
				{type && (
					<HeaderTypeCommentBox mode={mode}>
						<Typography
							variant="menuTitle"
							mobileVariant="menuTitle"
							component="span"
							color={theme.palette.green['text2']}
						>
							{t[type]}
						</Typography>
					</HeaderTypeCommentBox>
				)}
				<HeaderAvatarBox
					mode={mode}
					onClick={() =>
						dispatch(
							openModal({
								modalType: 'profile',
								modalProps: {
									wrapperClass: 'profileModal',
									...data,
								},
							})
						)
					}
				>
					{mode === 'subComment' && (
						<img src={arrowReplyIcon} alt="Arrow Reply Icon" />
					)}
					<div className="UserAvatar">
						<img
							src={
								url && status === '1'
									? url
									: defaultAvatars[personId % 10]
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
								<div className="HeaderPersonType">{title}</div>
								<HeaderPersonVerified
									src={verifiedIcon}
									alt="Person verified"
									right={
										mode === 'subComment' ? '23px' : '15px'
									}
								/>
								<VerifiedTooltip
									{...(mode === 'subComment'
										? {
											bottom: '24px',
											right: '-5px',
											fontSize: '12px',
											padding: '0 5px',
											beforeLeft: 'calc(50% - 3px)',
											beforeTransform:
                                                  'rotateZ(-90deg)',
											beforeTop: 'initial',
											beforeBottom: '-6px',
										}
										: {
											fontSize: '12px',
											padding: '0 5px',
											bottom: '-4px',
											right: '-67px',
										})}
								/>
							</>
						)}
					</Typography>
				</HeaderAvatarBox>
			</HeaderCommentContent>
			<HeaderCommentDate mode={mode}>
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
			</HeaderCommentDate>
		</HeaderCommentBox>
	);
};

HeaderComment.propTypes = {
	name: PropTypes.string.isRequired,
	type: PropTypes.string,
	status: PropTypes.string,
	url: PropTypes.string,
	created_at: PropTypes.string,
};

export default HeaderComment;
