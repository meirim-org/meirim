import styled from 'styled-components';
import { device } from '../../style';
import { Tabs } from '@material-ui/core';


export const MainWrapper = styled.div`
    display: grid;
    grid-template-columns: 60% 1fr;
    grid-template-rows: 1fr;
    grid-column-gap: 9px;
    height: 100vh;
`;

export const Content = styled.div`
    display: grid;
    grid-template-rows: 1fr 78%;
`;

export const Header = styled.div`
    display: grid;
    grid-template-columns: 55% 1fr;
`;

export const CustomTabs = styled(Tabs)`
    
`;

// overrides: {
//     MuiTab: {
//         textColorInherit: {
//             backgroundColor: '#ffffff',
//                 borderColor: '#652dd0',
//                 color: '#000000',
//         },
//         wrapper: {
//             backgroundColor: 'red',
//         },
//     },
// },
export const TitlesAndTabs = styled.div`

`;

export const Buttons = styled.div`

`;

export const SubTitleWrapper = styled.div`
    margin-bottom: 1rem;
`;

export const TitleWrapper = styled.div`
    margin-bottom: 3rem;
`;

export const InputWrapper = styled.div`
  margin-bottom: 1.5em;
  .MuiFormControl-root {
     width: 100%;
  }
`;

export const ButtonWrapper = styled.div`
  border-radius:0 0 12px 12px;
  background-color: #f1eef2;
  display: grid;
  padding: 0 1.5em 2.45em;
    @media ${device.tablet} {
     max-width: initial;
     padding-right: 3.7em;
     padding-left: 3.7em;
  }
`;

export const Label = styled.div`
  font-family: Assistant !important;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: right;
  color: #665d71;
`;

export const Star = styled.span`
  color:red;
`;
