import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import MUIButton from '@material-ui/core/Button';

export const IconWrapper = styled.div`
	display: flex;
	justify-content: center;
`;

export const Heading = styled.h3`
	color: #000;
	text-align: center;
	font-family: Assistant;
	font-size: 32px;
	font-style: normal;
	font-weight: 400;
	line-height: 42px;
	margin: 0;
`;

export const P = styled.p`
	color: #000;
	text-align: center;
	font-family: Assistant;
	font-size: 20px;
	font-style: normal;
	font-weight: 400;
	line-height: 26px;
	margin: 0;
`;

export const P_relative = styled.p`
	color: #000;
	text-align: center;
	font-family: Assistant;
	font-size: 20px;
	font-style: normal;
	font-weight: 700;
	line-height: 32px; /* 160% */	
	margin: 0;
`;

export const P_bold = styled.p`
	color: #000;
	text-align: center;
	font-family: Assistant;
	font-size: 20px;
	font-style: normal;
	font-weight: 700;
	line-height: 32px;
	margin: 0;
`;

export const TextWrapper = styled.div`
	margin-top: 16px;
`;

export const ButtonWrapper = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 74px;
`;

export const BoldColored = styled.span`
	color: #652dd0;
	font-weight: bold;
`;

export const Button = withTheme(styled(MUIButton)`
	border: none !important;
	cursor: pointer !important;
	display: flex !important;
	padding: 10px 90px !important;
	justify-content: center !important;
	align-items: center !important;
	gap: 8px !important;
	border-radius: 8px !important;
	background: #8f5de2 !important;
	color: #fff !important;
	text-align: center !important;
	font-family: Assistant !important;
	font-size: 24px !important;
	font-style: normal !important;
	font-weight: 700 !important;
	line-height: 32px;
	text-transform: none !important;

	&:focus {
		outline: none;
	}
`);
