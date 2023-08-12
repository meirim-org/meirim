import React from 'react';
import {
	UserProfileAboutMe,
	UserProfileAvatar,
	UserProfileAvatarBox,
	UserProfileBox,
	UserProfileContent,
	UserProfileName,
	UserProfileSocial,
	UserProfileSocials,
	UserProfileTitle,
	UserProfileType,
	UserProfileVerified,
} from './style';
import verifiedIcon from '../../assets/icons/verified.svg';
import facebookIcon from '../../assets/icons/socials/facebook.svg';
import linkedInIcon from '../../assets/icons/socials/linkedin.svg';
import twitterIcon from '../../assets/icons/socials/twitter.svg';
import emailIcon from '../../assets/icons/socials/email.svg';
import PropTypes from 'prop-types';
import { useTranslation } from '../../locale/he_IL';
import VerifiedTooltip from '../VerifiedTooltip/VerifiedTooltip';
import { defaultAvatars } from '../../assets/avatars/defaultAvatars';

const UserProfile = (props) => {
	const {
		url,
		name,
		title,
		about_me_public,
		facebook,
		twitter,
		linkedin,
		email_public,
		status,
	} = props;

	const { t } = useTranslation();

	return (
		<UserProfileBox>
			<UserProfileAvatarBox>
				<UserProfileAvatar
					src={url && status === '1' ? url : defaultAvatars[8]}
				/>
				{status === '1' && (
					<>
						<UserProfileVerified src={verifiedIcon} />
						<VerifiedTooltip>{t.profileVerified}</VerifiedTooltip>
					</>
				)}
			</UserProfileAvatarBox>
			{name && <UserProfileName>{name}</UserProfileName>}
			{title && <UserProfileType>{title}</UserProfileType>}
			<UserProfileSocials>
				{facebook && (
					<UserProfileSocial href={facebook} target="_blank">
						<img src={facebookIcon} alt="Facebook Icon" />
					</UserProfileSocial>
				)}
				{linkedin && (
					<UserProfileSocial href={linkedin} target="_blank">
						<img src={linkedInIcon} alt="LinkedIn Icon" />
					</UserProfileSocial>
				)}
				{twitter && (
					<UserProfileSocial href={twitter} target="_blank">
						<img src={twitterIcon} alt="Twitter Icon" />
					</UserProfileSocial>
				)}
				{email_public && (
					<UserProfileSocial
						href={`mailto:${email_public}`}
						target="_blank"
					>
						<img src={emailIcon} alt="Email Icon" />
					</UserProfileSocial>
				)}
			</UserProfileSocials>
			{about_me_public && (
				<UserProfileContent>
					<UserProfileTitle>{t.aboutMePublic}</UserProfileTitle>
					{about_me_public && (
						<UserProfileAboutMe>
							{about_me_public}
						</UserProfileAboutMe>
					)}
				</UserProfileContent>
			)}
		</UserProfileBox>
	);
};

UserProfile.propTypes = {
	url: PropTypes.string,
	name: PropTypes.string.isRequired,
	type: PropTypes.string,
	title: PropTypes.string,
	about_me_public: PropTypes.string,
	facebook: PropTypes.string,
	twitter: PropTypes.string,
	linkedin: PropTypes.string,
	email_public: PropTypes.string,
	status: PropTypes.string,
};

export default UserProfile;
