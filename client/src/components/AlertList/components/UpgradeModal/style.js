import styled from 'styled-components';

export const TitleWrapper = styled.div``;

export const PrimaryTitle = styled.h3`
	color: #652dd0;
	text-align: center;
	font-family: Assistant;
	font-size: 32px;
	font-style: normal;
	font-weight: 700;
	line-height: 42px;
`;

export const SecondaryTitle = styled.h4`
	color: #000;
	text-align: center;
	font-family: Assistant;
	font-size: 20px;
	font-style: normal;
	font-weight: 700;
	line-height: 32px;
`;

export const Text = styled.p`
	color: #000;
	text-align: center;
	font-family: Assistant;
	font-size: 16px;
	font-style: normal;
	font-weight: 400;
	line-height: 24px;
`;

export const CardList = styled.ul`
	margin: 0;
	padding: 0;
	display: flex;
	justify-content: center;
	gap: 16px;
	margin-top: 32px;
	flex-wrap: wrap;

	@media screen and (max-width: 480px) {
		justify-content: flex-start;
		flex-wrap: nowrap;
		overflow-x: scroll;
		scroll-snap-type: x mandatory;
		-ms-overflow-style: none;
		scrollbar-width: none;

		padding: 30px 20px;
		margin: 0 -15px;

		&::-webkit-scrollbar {
			display: none;
		}
		& > div {
			scroll-snap-align: center;
		}
	}

	.loading {
		margin: 0 auto;
	}
`;

export const Note = styled.p`
	color: #000;
	text-align: center;
	font-family: Assistant;
	font-size: 18px;
	font-style: normal;
	font-weight: 400;
	line-height: 24px;
	max-width: 482px;
	margin: 0 auto;
	margin-top: 32px;

	a {
		color: #652dd0;
		text-decoration: underline;
	}
`;
