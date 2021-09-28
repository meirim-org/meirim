import styled from 'styled-components';
import { colors, device } from 'style';

export const Wrapper = styled.div`
width: 100%;
position: relative;

@media ${device.tablet} {
    width: ${props => props.width};
}
`

export const Menu = styled.ul`
border: 1px solid ${colors.purple[500]};
border-top: none;
border-radius: 0px 0px 4px 4px;
position: absolute;
top: 41px;
z-index: 1000;
width: 100%;
padding: 0;
`

export const InputWrapper = styled.div`
display: flex;
height: 44px;
`

export const Input = styled.input`
flex: 1;
border: 1px solid ${colors.purple[500]};
border-radius: 0px 4px 4px 0px;
padding: 0 15px;
background-color: ${colors.white};
z-index: 1001;
`

export const Button = styled.button`
color: ${colors.white};
padding: 13px;
border: none;
border-radius: 4px 0px 0px 4px;
background: ${colors.purple[500]};
width: 44px;
z-index: 1001;
cursor: pointer;
display: flex;
justify-content: center;
align-items: center;
&:focus{
    outline: none;
}
`