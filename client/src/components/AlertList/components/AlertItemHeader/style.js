import styled from 'styled-components';

export const ButtonWrapper = styled.div`
	padding: 2rem 4.8rem;
	display: flex;
	justify-content: space-between;

	@media screen and (max-width: 1024px) {
		padding: 2rem 1rem;
	}

	@media screen and (max-width: 515px) {
		align-items: center;
		flex-direction: column;
		gap: 14px;
	}
`;

export const ButtonWrapper__text = styled.div`
	p {
		margin: 0;
		color: #1f1c21;
		text-align: right;
		font-family: Assistant;
		font-size: 18px;
		font-style: normal;
		font-weight: 400;
		line-height: 24px;

		@media screen and (max-width: 515px) {
			text-align: center;
		}

		&:first-child {
			margin-bottom: 8px;
		}
	}

	b {
		font-weight: 600;
	}
`;
