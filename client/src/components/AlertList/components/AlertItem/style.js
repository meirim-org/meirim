import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';

export const Li = styled.li`
	padding: 24px;
	border-radius: 12px;
	border: 1px solid #e6e6e6;
	background: #fff;
	font-family: Assistant;
	font-size: 20px;
	font-style: normal;
	font-weight: 600;
	line-height: 26px;
	background: ${(props) => (props.disabled ? '#FBFBFB' : '#fff')};
`;

export const FlexWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;

	@media screen and (max-width: 768px) {
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;
	}
`;

export const DivContent = styled.div`
	width: 200px;
	display: flex;
	filter: grayscale(${(props) => (props.disabled ? 1 : 0)});
`;

export const DivInfo = styled.div`
	padding-right: 34px;
	margin-top: 10px;
`;

export const Icon = styled.div`
	display: inline-block;
	margin-left: 6px;
`;

export const RadiusLabel = styled.span`
	color: #918899;
	font-family: Assistant;
	font-size: 20px;
	font-style: normal;
	font-weight: 400;
	line-height: 26px; /* 130% */
	margin-left: 8px;
`;

export const RadiusValue = styled.span`
	color: #1f1c21;
	font-family: Assistant;
	font-size: 20px;
	font-style: normal;
	font-weight: 400;
	line-height: 26px; /* 130% */
`;

export const Buttons = withTheme(styled.div`
	display: flex;
	gap: 16px;
	text-align: left;
	margin: 0 -0.25rem;
	flex-wrap: wrap;
	justify-content: flex-end;

	@media screen and (max-width: 768px) {
		justify-content: flex-start;
		padding-right: 34px;
	}

	.MuiButton-containedPrimary {
		background-color: transparent !important;
		border: solid 1px #cdc9d8;
		box-shadow: none;
		color: ${(props) => props.theme.palette.black['100']} !important;
	}

	.MuiButton-startIcon {
		margin: 0;
	}
	.MuiButton-root {
		padding: 0.4rem 0.35rem;

		&:hover,
		&:focus {
			box-shadow: none;
			outline: 0 !important;
		}
	}

	.MuiButton-label > span {
		padding: 0 0.25rem;
	}
	.MuiButton-startIcon svg {
		fill: ${(props) =>
			props.theme.palette.secondary.contrastForGraphics} !important;
	}

	.MuiChip-root {
		border-radius: 4px;
		background: #f5f5f5;
		color: #1f1c21;
		font-family: Assistant;
		font-size: 16px;
		font-style: normal;
		font-weight: 400;
		line-height: 24px;
		height: auto;
		padding: 0 12px;
	}

	.MuiChip-label {
		padding: 0;
	}

	.Reactivate-button {
		span {
			margin: 0;
		}
	}

	.Premium-chip {
		.MuiChip-label {
			padding-right: 8px;
		}
	}

	.Disabled-chip {
		color: #1f1c21;
		text-align: center;
		font-family: Assistant;
		font-size: 16px;
		font-style: normal;
		font-weight: 600;
		line-height: 24px;
		background: none;
		padding: 0 4px;

		span {
			padding: 0;
		}

		svg {
			color: #999999;
		}
	}
`);
