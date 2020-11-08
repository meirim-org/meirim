import styled from "styled-components"

export const Titles = styled.div`
  display: grid;
`
export const Title = styled.h1`
	font-size: 1.8em;
  text-align: center;
  font-family: Assistant;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #29244a;
`

export const SubTitle = styled.h1`
  font-family: Assistant;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  line-height: 1.5;
  text-align: center;
  color: #000000;
`
export const SubTitleWrapper = styled.div`
  padding-top: 1em;
  padding-bottom: 1em;
`
export const InputsWrapper = styled.div`
  display: grid;
  /* height: 70%; */
  /* border-radius:0 0 12px 12px; */
  background-color: #f1eef2;
`
export const MainWrapper = styled.div`
  display: grid;
  grid-template-rows: 5em 25em 5em;
`

export const InputWrapper = styled.div`
  padding: 1em 2em 0 2em;
  display: flex;
flex-direction: column;
`
export const InputsTitle = styled.div`
  font-family: Assistant;
  font-size: 20px;
  font-weight: normal;
  padding-top: 1em;
  padding-bottom: 0;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: #3e385c;
`

export const ButtonWrapper = styled.div`
  border-radius:0 0 12px 12px;
  background-color: #f1eef2;
  display: grid;
  padding-left: 2em;
  padding-right: 2em;
`

export const Label = styled.div`
  font-family: Assistant;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: right;
  color: #665d71;
`

export const Star = styled.span`
  color:red;
`
export const Link = styled.span`
  cursor: pointer;
  font-family: Assistant;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: var(--meirim-purple);
  text-decoration: underline;
	color: #652dd0;
`