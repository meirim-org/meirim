import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TabPanel, TabBox, Text, Button } from 'shared';
import t from 'locale/he_IL';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import * as SC from './style';
import { UserSelectors } from 'redux/selectors';
import { openModal } from 'redux/modal/slice';
import { useDispatch } from 'react-redux';
import { colors } from 'style';

export const SubscribePanel = ({ subscribePanel, handleSubscribePanel }) => {
	const dispatch = useDispatch()
	const [ isOpen, setIsOpen ] = useState(true)
	const { isAuthenticated } = UserSelectors()

	if ( isAuthenticated || !isOpen ) return null;

	return (
		<TabPanel>
			<TabBox position="relative" bgColor={colors.purple[100]} borderColor={colors.purple[200]}>
				<SC.SubscribeIconWrapper>
					<NotificationsNoneIcon />
				</SC.SubscribeIconWrapper>
				<SC.SubscribeTextWrapper>
					<Text text={t.subscribeTitle} color={colors.purple[800]} weight="600" />
					<br/>
					<Text text={t.subscribeText} color={colors.purple[800]} />
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