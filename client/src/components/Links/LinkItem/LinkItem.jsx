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
            return 'הצטרפות לקבוצה';
        case 'facebook':
            return 'מעבר לדף';
        case 'web':
            return 'לצפייה בקישור';

        default:
            return 'לצפייה בקישור';
    }
};

const LinkItem = ({ type, link, title, description }) => {
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
                <a target="_blank" href={link} rel="noreferrer">
                    {getLinkActionText(type)}
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
