import React from 'react';
import PropTypes from 'prop-types';
import { TabPanel, TabBox, Text, Button } from 'shared';
import t from 'locale/he_IL';
import { useTheme } from '@material-ui/styles';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import * as SC from './style';

export const SubscribePanel = ({ tabValue, subscribePanel, handleSubscribePanel }) => {
	const theme = useTheme();

	//add user connection condition 
	if ( !subscribePanel ) return null;

	return (
		<TabPanel value={tabValue} index={0}>
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
						<Button onClick={() => alert('הרשמה')} extrasmall={true} text={t.signup}/>
					</SC.SubscribeButtonWrapper>
					<SC.SubscribeButtonWrapper>
						<Button 
							fontSize="14px"
							textDecoration="underline"
							simple={true} 
							fontWeight="400" 
							onClick={() => handleSubscribePanel(false)}
							text={t.noThanks}
					 />
					</SC.SubscribeButtonWrapper>
				</SC.SubscribeButtonsWrapper>
				<SC.CloseSubscribeIcon onClick={() => handleSubscribePanel(false)} />
			</TabBox>
		</TabPanel>
	);
};

SubscribePanel.propTypes = {
	tabValue: PropTypes.any.isRequired,
	subscribePanel: PropTypes.bool.isRequired,
	handleSubscribePanel: PropTypes.func.isRequired,
};

export default SubscribePanel;