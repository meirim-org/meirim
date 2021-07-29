import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import { useTheme } from '@material-ui/styles';
import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from 'redux/modal/slice';
import { UserSelectors } from 'redux/selectors';
import { Button, TabBox, TabPanel, Text } from 'shared';
import * as SC from './style';

export const SubscribePanel = ({ subscribePanel, handleSubscribePanel }) => {
	const dispatch = useDispatch()
	const theme = useTheme();
	const [ isOpen, setIsOpen ] = useState(true)
	const { isAuthenticated } = UserSelectors()
	const { t } = useTranslation();

	if ( isAuthenticated || !isOpen ) return null;

	return (
		<TabPanel>
			<TabBox position="relative" bgColor={theme.palette.primary['100']} borderColor={theme.palette.primary['200']}>
				<SC.SubscribeIconWrapper>
					<NotificationsNoneIcon />
				</SC.SubscribeIconWrapper>
				<SC.SubscribeTextWrapper>
					<Text text={t.subscribeTitle} color={theme.palette.primary['800']} weight="600" />
					<br/>
					<Text text={t.subscribeText} color={theme.palette.primary['800']} />
				</SC.SubscribeTextWrapper>
				<SC.SubscribeButtonsWrapper>
					<SC.SubscribeButtonWrapper>
						<Button onClick={() => dispatch(openModal({ modalType: 'register' }))} extrasmall={true} text={t.signup}/>
					</SC.SubscribeButtonWrapper>
					<SC.SubscribeButtonWrapper>
						<Button 
							fontSize="14px"
							textDecoration="underline"
							simple={true} 
							fontWeight="400" 
							onClick={() => setIsOpen(false)}
							text={t.noThanks}
					 />
					</SC.SubscribeButtonWrapper>
				</SC.SubscribeButtonsWrapper>
				<SC.CloseSubscribeIcon onClick={() => setIsOpen(false)} />
			</TabBox>
		</TabPanel>
	);
};

SubscribePanel.propTypes = {
	subscribePanel: PropTypes.bool.isRequired,
	handleSubscribePanel: PropTypes.func.isRequired,
};

export default SubscribePanel;