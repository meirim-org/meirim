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
import defaultAvatar from '../../assets/svg/defaultAvatar.svg';
import verifiedIcon from '../../assets/icons/verified.svg';
import facebookIcon from '../../assets/icons/socials/facebook.svg';
import linkedInIcon from '../../assets/icons/socials/linkedin.svg';
import twitterIcon from '../../assets/icons/socials/twitter.svg';
import emailIcon from '../../assets/icons/socials/email.svg';
import PropTypes from 'prop-types';

const UserProfile = (props) => {
	console.log({ props });
	const {
		url,
		name,
		type,
		title,
		about_me_public,
		facebook,
		twitter,
		linkedin,
		email_public,
		status,
	} = props;

	return (
		<UserProfileBox>
			<UserProfileAvatarBox>
				<UserProfileAvatar
					src={url && status === '1' ? url : defaultAvatar}
				/>
				{status === '1' && <UserProfileVerified src={verifiedIcon} />}
			</UserProfileAvatarBox>
			{name && <UserProfileName>{name}</UserProfileName>}
			{type && <UserProfileType>{type}</UserProfileType>}
			<UserProfileSocials>
				{facebook && (
					<UserProfileSocial href={facebook}>
						<img src={facebookIcon} alt="Facebook Icon" />
					</UserProfileSocial>
				)}
				{linkedin && (
					<UserProfileSocial href={linkedin}>
						<img src={linkedInIcon} alt="LinkedIn Icon" />
					</UserProfileSocial>
				)}
				{twitter && (
					<UserProfileSocial href={twitter}>
						<img src={twitterIcon} alt="Twitter Icon" />
					</UserProfileSocial>
				)}
				{email_public && (
					<UserProfileSocial href={`mailto:${email_public}`}>
						<img src={emailIcon} alt="Email Icon" />
					</UserProfileSocial>
				)}
			</UserProfileSocials>
			{(title || about_me_public) && (
				<UserProfileContent>
					{title && <UserProfileTitle>{title}</UserProfileTitle>}
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
