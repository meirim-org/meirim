// import styles from './style';
import React from 'react';
import {
	FacebookLinkIcon,
	WebLinKIcon,
	WhatsappLinkIcon,
} from '../../../assets/icons';
import {
	LinkItemAction,
	LinkItemGeneral,
	LinkItemIcon,
	LinkItemText,
	LinkItemTitle,
	LinkItemWrapper,
} from './style';
import PropTypes from 'prop-types';
import { useTranslation } from '../../../locale/he_IL';

const getLinkIcon = (type) => {
	switch (type) {
	case 'whatsapp':
		return WhatsappLinkIcon;
	case 'facebook':
		return FacebookLinkIcon;
	case 'web':
		return WebLinKIcon;

	default:
		return WebLinKIcon;
	}
};

const getLinkActionText = (type) => {
	switch (type) {
	case 'whatsapp':
		return 'whatsappLinkAction';
	case 'facebook':
		return 'facebookLinkAction';
	case 'web':
		return 'webLinkAction';

	default:
		return 'webLinkAction';
	}
};

const LinkItem = ({ type, link, title, description }) => {
	const { t } = useTranslation();

	const formatLink = () => {
		if (link.includes('http')) {
			return link;
		}
		
		return `https://${link}`;
	};

	return (
		<LinkItemWrapper>
			<LinkItemGeneral>
				<div className="LinkItem__content">
					<LinkItemTitle>{title}</LinkItemTitle>
					<LinkItemText>{description}</LinkItemText>
				</div>
				<LinkItemIcon>
					<img src={getLinkIcon(type)} alt="" />
				</LinkItemIcon>
			</LinkItemGeneral>
			<LinkItemAction>
				{/* eslint-disable-next-line react/jsx-no-target-blank */}
				<a target="_blank" href={formatLink(link)} rel="noreferrer">
					{t[getLinkActionText(type)]}
				</a>
			</LinkItemAction>
		</LinkItemWrapper>
	);
};

LinkItem.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	type: PropTypes.string,
	link: PropTypes.string,
	actionText: PropTypes.string,
	color: PropTypes.string,
};

export default LinkItem;
