import React from 'react';
import { Text, Button } from 'shared';
import t from 'locale/he_IL';
import styled from 'styled-components';
import { copiedToClipboard } from 'toasts';
import { CopyToClipboard } from  'react-copy-to-clipboard';
import { useTheme } from '@material-ui/styles';
import * as SC from './style';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';

const SharePlan = () => {
	const theme = useTheme();

	return (
		<SC.ShareWrapper>
			<SC.ShareTitleWrapper>
				<Text text={t.sharePlan} weight="600" size="32px" color={theme.palette.primary['800']}/>
			</SC.ShareTitleWrapper>

			<SC.ShareActionWrapper>
				<SC.ShareButtonWrapper>
					<Button text={t.whatsappShare} weight="600" fontSize="14px" textcolor={theme.palette.white} iconBefore={<WhatsAppIcon/>} />
				</SC.ShareButtonWrapper>
				<SC.ShareTextWrapper>
					<Text text={t.copyUrl} size="14px" color={theme.palette.black}/>
				</SC.ShareTextWrapper>
			</SC.ShareActionWrapper>

			  {/* <a
				className="share-link"
				target="_blank"
				rel="noopener noreferrer"
				href={'https://wa.me/?text=תוכנית%20שאולי%20תעניין%20אותך%3A%0A' + encodeURI(window.location.toString())}>
				<Button onClick={() => {console.log('clicked share');}} text="שתיוף ב- Whatsapp"/></a>
			<CopyToClipboard text={encodeURI(window.location.toString())} onCopy={() => copiedToClipboard()}>
				<button>Copy to clipboard with button</button>
			</CopyToClipboard> */}
		</SC.ShareWrapper>
	);
};

export default SharePlan;