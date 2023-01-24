// import styles from './style';
import React from 'react';
import { WhatsappLinkIcon } from '../../assets/icons';
import {
    LinkItemAction,
    LinkItemIcon,
    LinkItemText,
    LinkItemTitle,
    LinkItemWrapper,
} from './style';

const LinkItem = () => {
    return (
        <LinkItemWrapper>
            <div className="LinkItem__content">
                <LinkItemTitle>מתכננים ונהנים</LinkItemTitle>
                <LinkItemText>
                    קבוצת וואצאפ של תושבי השכונה אשר מביעים את דעתם על התכנון
                    העתידי.
                </LinkItemText>
                <LinkItemAction>
                    <a target="_blank" href="#">
                        לצפייה בקישור
                    </a>
                </LinkItemAction>
            </div>
            <LinkItemIcon color="#ADEBD6">
                <img src={WhatsappLinkIcon} alt="" />
            </LinkItemIcon>
        </LinkItemWrapper>
    );
};

export default LinkItem;
