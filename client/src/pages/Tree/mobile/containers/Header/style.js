import styled from 'styled-components';
import { AppBar as MuiAppBar, Button } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';

export const TitlesButtonWrapper = styled.div`
   margin-top: 1rem;
   padding: 0 3.425rem 0;    
   position: relative;
`;

export const SubTitleWrapper = styled.div`
    margin-bottom: .5rem;
`;

export const TitleWrapper = styled.div`
    margin-bottom: 2rem;
`;

export const Header = withTheme(styled.div`
    background: ${props => props.theme.palette.gray['100']} !important;
    border-bottom: 1px solid ${props => props.theme.palette.gray['300']};
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    &.low {
        padding-bottom: 1rem;
        * {
            margin-bottom: 0;
        }
    }
    .back-button {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        &:focus {
            outline: none;
        }
    }
    .fixed {
        position: fixed;
        top: 79px;
        background: ${props => props.theme.palette.gray['100']} !important;
        left: 0;
        padding-right: 3.425rem;
        padding-left: 2.3rem;
        border-bottom: 1px solid ${props => props.theme.palette.gray['300']};
        z-index: 99999;
    }
`);

export const HeaderContent = styled.div`
    position: relative;
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
        padding: 0 .25rem;
    }
    .MuiButton-startIcon svg{
        fill: ${props => props.theme.palette.secondary.contrastForGraphics} !important;
    }
`);

export const AppBar = withTheme(styled(MuiAppBar)`
    padding: 0 3.425rem 0 1rem;    
    background-color:  transparent !important;
    color: black !important;
    box-shadow: none !important;
    .MuiTab-root {
        min-width: auto !important;
        padding: .4rem 1rem;
    }
    .MuiTabs-indicator {
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

export const Tab = withTheme(styled(Button)`
    border-radius: 0 !important;
    border-bottom: 2px solid transparent !important;
    outline: 0 !important;
    padding-right: .7rem !important;
    padding-left: .7rem !important;
    @media(min-width: 360px) {
        padding-right: 1.1rem !important;
        padding-left: 1.1rem !important;
    }
    @media(min-width: 375px) {
        padding-right: 1.4rem !important;
        padding-left: 1.4rem !important;
    }

    white-space: nowrap;
    
    .MuiButton-label {
        color:  ${props => props.theme.palette.black} !important;
        font-size:  14px !important;
        font-weight: 400;
    }
    
    .MuiBadge-badge {
        font-size:  12px !important;
        font-weight: 600;
    }
    
    
    &.active {
        border-color: ${props => props.theme.palette.primary.main} !important;
        .MuiButton-label {
            color:  ${props => props.theme.palette.primary.main} !important;
        }
    }
`);

export const TabWrapper = styled.div`
    display: flex;    
`;
