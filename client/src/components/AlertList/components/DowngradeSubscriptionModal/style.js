import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import MUIButton from '@material-ui/core/Button';

export const H3 = styled.h3`
	color: #000;
	text-align: center;
	font-family: Assistant;
	font-size: 32px;
	font-style: normal;
	font-weight: 400;
	line-height: 42px;
	margin-bottom: 0;
`;

export const Span_colored = styled.span`
	color: #652dd0;
	font-weight: bold;
`;

export const P_bold = styled.p`
	color: #000;
	text-align: center;
	font-family: Assistant;
	font-size: 20px;
	font-style: normal;
	font-weight: 700;
	line-height: 32px;
	margin-bottom: 0;
`;

export const ButtonWrapper = styled.div`
	display: flex;
	gap: 40px;
	margin: 42px auto 0;
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
	transition: all 0.2s !important;

	&.secondary {
		background: #fff !important;
		color: #8f5de2 !important;
		border: 2px solid #8f5de2 !important;

		&:hover {
			opacity: 0.8;
		}
	}

	&.primary {
		&:hover {
			background-color: #4d20b2 !important;
		}
	}

	&:focus {
		outline: none;
	}
`);

export const LoadingWrapper = styled.div`
	display: flex;
	justify-content: center;
`;
