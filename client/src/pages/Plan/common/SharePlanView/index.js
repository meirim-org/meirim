import React from 'react';
import { Text, Button } from 'shared';
import t from 'locale/he_IL';
import { copiedToClipboard } from 'toasts';
import { CopyToClipboard } from  'react-copy-to-clipboard';
import { useTheme } from '@material-ui/styles';
import * as SC from './style';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';

const url = 'https://wa.me/?text=תוכנית%20שאולי%20תעניין%20אותך%3A%0A' + encodeURI(window.location.toString());

const SharePlanView = () => {
	const theme = useTheme();

	return (
		<SC.ShareWrapper>
			<SC.ShareTitleWrapper>
				<Text text={t.sharePlan} weight="600" size="32px" color={theme.palette.primary['800']}/>
			</SC.ShareTitleWrapper>

			<SC.ShareActionWrapper>

				<SC.ShareButtonWrapper>
					<Button
					 component="a"
					 href={url}
					 target="_blank"
					 text={t.whatsappShare} 
					 fontWeight="600" 
					 fontSize="14px" 
					 textcolor={theme.palette.white}
					 iconBefore={<WhatsAppIcon/>} />
				</SC.ShareButtonWrapper>

				<SC.ShareTextWrapper>
					<Text text={t.copyUrl} size="14px" color={theme.palette.black}/>
				</SC.ShareTextWrapper>

				<SC.CopyUrlArea>
					<Text text={url} size="14px" color={theme.palette.black}/>
					<CopyToClipboard text={url} onCopy={() => copiedToClipboard()}>
						<Button
						 text={t.copy} 
						 fontSize="14px" 
						 fontWeight="400" 
						 textcolor={theme.palette.primary.main}
						 simple={true}
						 />
					</CopyToClipboard>
				</SC.CopyUrlArea>

			</SC.ShareActionWrapper>
		</SC.ShareWrapper>
	);
};

export default SharePlanView;