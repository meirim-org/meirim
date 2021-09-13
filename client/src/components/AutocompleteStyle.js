import styled from 'styled-components';
import { colors } from 'style';

export const Menu = styled.ul`
border: 1px solid ${colors.purple[500]};
border-top: none;
border-radius: 0px 0px 4px 4px;
position: absolute;
top: 41px;
z-index: 0;
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
z-index: 1;
`

export const Button = styled.button`
color: ${colors.white};
border: none;
border-radius: 4px 0px 0px 4px;
background: ${colors.purple[500]};
width: 44px;
z-index: 1;
cursor: pointer;
    &:focus{
        outline: none;
    }
        display: flex;
    justify-content: center;
    align-items: center;
`