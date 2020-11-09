import styled from "styled-components"

export const MainWrapper = styled.div`
    width: 100%;
    display: grid;
    grid-template-rows: 1fr;
    height: 100vh;
    grid-template-columns: 55% 45%;
`

export const ImageCol = styled.div`
    position: relative;
    overflow: hidden;
    &:before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        mix-blend-mode: color;
        background-image: linear-gradient(to top right, #6200ee, #eb8c47);
        height: 100%;
        width: 100%;
    }   
    &:after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        background: #f8f8f8;
        height: 110%;
        transform: translateX(100%) rotate(3.5deg);
        transform-origin: top left;
        width: 100%;
    }
`
export const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: right;
`
export const ContentCol = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`
export const Content = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 1rem;
`
export const PreTitle = styled.span`
  font-family: Assistant;
  font-size: 24px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #000000;
  margin-bottom: 1.4rem;
`
export const Title = styled.h1`
  font-family: Assistant;
  font-size: 32px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  letter-spacing: normal;
  text-align: center;
  color: #000000;
  margin-bottom: 1.4rem;
`
export const Text = styled.span`
  font-family: Assistant;
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #000000;
  margin-bottom: 1.2rem;
`

export const SmallTextWrapper = styled.div`
  text-align: center;
`
export const SmallText = styled.span`
  font-family: Assistant;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #000000;
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
