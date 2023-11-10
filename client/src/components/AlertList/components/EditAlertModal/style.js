import styled from 'styled-components';

export const Form = styled.form`
	display: flex;
	flex-direction: column;

	.row {
		&__heading {
			margin-bottom: 40px;
		}

		&__radiusSection {
			margin: 40px 0;
		}

		&__fixedRadiusSection {
			margin: 40px 0;

			.col {
				padding: 0;
			}
		}
	}

	.rc-slider-mark-text-active {
		&:nth-child(${(props) => props.radius}) {
			color: #1f1c21;
			font-weight: 700;
		}
	}

	.rc-slider-mark-text {
		text-wrap: nowrap;
	}

	.alertModal__slider {
		margin: 0 auto;
		max-width: 530px;
		padding-bottom: 26px;
	}

	.title {
		color: #1f1c21;
		text-align: right;
		font-feature-settings: 'clig' off, 'liga' off;
		font-family: Assistant;
		font-size: 36px;
		font-style: normal;
		font-weight: 700;
		line-height: 42px;
	}

	.subtitle {
		color: #1f1c21;
		text-align: right;
		font-family: Assistant;
		font-size: 20px;
		font-style: normal;
		font-weight: 400;
		line-height: 26px;
		margin: 0;
	}

	.alertModal__label {
		color: #1f1c21;
		text-align: right;
		font-family: Assistant;
		font-size: 20px;
		font-style: normal;
		font-weight: 600;
		line-height: 26px;
		margin-bottom: 12px;
	}

	.alertModal__input {
		padding: 12px;
		border-radius: 8px;
		border: 1px solid #b8b8b8;
		background: #fbfbfb;
	}

	.alertModal__suggestions {
		position: relative;

		.MuiPaper-root {
			max-height: 200px;
			width: 100%;
			position: absolute;
			overflow: auto;
			z-index: 99999;
		}
	}

	.alertModal__inputPWrapper {
		margin-top: 10px;

		p {
			margin: 0;
		}
	}

	.alertModal__flex {
		display: flex;
		justify-content: space-between;
	}

	.alertModal__radiusLock {
		display: flex;
		align-items: center;
		margin: 0;
		gap: 8px;
	}

	.alertModal__buttonsWrapper {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
		margin-top: 16px;
	}

	.alertModal__button {
		padding: 12px 16px;
		border-radius: 8px;
		color: black;
		text-align: center;
		font-family: Assistant;
		font-size: 18px;
		font-style: normal;
		font-weight: 600;
		line-height: 24px;
		cursor: pointer;

		outline: none;

		&_submit {
			color: #fff;
			background: #652dd0;
			border: none;

			svg {
				margin-right: 8px;
			}

			&:disabled {
				opacity: 0.5;
				cursor: not-allowed;
			}
		}

		&_cancel {
			color: #652dd0;
			background: #fff;
			border-color: #652dd0;
		}
	}
`;
