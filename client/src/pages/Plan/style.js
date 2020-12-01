import styled from 'styled-components';
import { device } from '../../style';
import { AppBar as MuiAppBar } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles'

export const MainWrapper = styled.div`
    display: grid;
    grid-template-columns: 60% 1fr;
    grid-template-rows: 1fr;
    height: calc(100vh - 79px);
    overflow: hidden;
    @media ${device.tablet} {
       height: calc(100vh - 72px);
    }
`;

export const Content = styled.div`
    box-shadow: -3px 0 24px 0 rgba(0, 0, 0, 0.08);
    overflow-y: auto;
`;

export const Header = withTheme(styled.div`
    display: grid;
    grid-template-columns: 49% 1fr;
    padding: 1rem 4.8rem 0 1.2rem;
    border-bottom: 1px solid  ${props => props.theme.palette.gray['300']};
`);

export const Main = withTheme(styled.main`
    background-color:  ${props => props.theme.palette.gray['bg']};
    padding: 2.5rem 4.8rem;
    min-height: 140vh;
`);

export const AppBar = withTheme(styled(MuiAppBar)`
    background-color:  transparent !important;
    color: black !important;
    box-shadow: none !important;
    .MuiTab-root {
        min-width: auto !important;
        padding: .4rem 1.5rem;
    }
    .PrivateTabIndicator-colorSecondary-3 {
        background-color:  ${props => props.theme.palette.primary.main} !important;
    }
    .Mui-selected {
        outline: 0 !important;
        color:  ${props => props.theme.palette.primary.main} !important;
    }
    .MuiBadge-root {
        align-items: center;
    }
    .MuiBadge-badge {
        position: relative;
        margin-right: .25rem;
        transform: none;
        color: ${props => props.theme.palette.primary['600']} !important;
        background-color: ${props => props.theme.palette.primary['bg']} !important;
    }
`);

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

export const Buttons = withTheme(styled.div`
    text-align: left;
    margin: 0 -.25rem;
    .MuiButton-containedPrimary {
        background-color: transparent !important;
        border: solid 1px #cdc9d8;
        box-shadow: none;
        color: ${props => props.theme.palette.black['100']} !important;
    }
    .MuiButton-startIcon {
        margin: 0;
    }
    .MuiButton-root {
        padding: .4rem .35rem;
        margin: 0 .25rem;
        &:hover, &:focus {
            box-shadow: none;
            outline: 0 !important;
        }
    }
    .MuiButton-label > span {
        font-size: 14px;
        padding: 0 .25rem;
        color: ${props => props.theme.palette.gray['800']} !important;
    }
    .MuiButton-startIcon svg{
        fill: ${props => props.theme.palette.secondary.contrastForGraphics} !important;
    }
`);

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
