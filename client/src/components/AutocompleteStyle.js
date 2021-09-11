import styled from 'styled-components';

export const Menu = styled.ul`
border: 1px solid #652DD0;
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
border: 1px solid #652DD0;
border-radius: 0px 4px 4px 0px;
padding: 0 15px;
background-color: white;
z-index: 1;
`

export const Button = styled.button`
color: #FFFFFF;
border: none;
border-radius: 4px 0px 0px 4px;
background: #652DD0;
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