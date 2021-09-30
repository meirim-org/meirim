import styled from 'styled-components';
import { AppBar as MuiAppBar, Button } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import { colors } from 'style';

export const SubTitleWrapper = styled.div`
    position: relative;
    margin-bottom: 1rem;
    .back-button {
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(112%, -23%);
        svg {
            font-size: 1.35rem;
        }
    }
`;

export const TitleWrapper = styled.div`
    margin-bottom: 3rem;
`;

export const Header = withTheme(styled.header`
    padding: 2rem 4.8rem 0 2rem;
    border-bottom: 1px solid ${props => props.theme.palette.gray['300']};
    display: grid;
    grid-template-columns: 56% 1fr;
`);

export const TitlesAndTabs = styled.div`
`;

export const Buttons = withTheme(styled.div`
    text-align: left;
    margin: 0 -.25rem;
    .MuiButton-containedPrimary {
        background-color: transparent !important;
        border: solid 1px #cdc9d8;
        box-shadow: none;
        color: ${colors.black} !important;
    }
    .MuiButton-startIcon {
        margin: 0;
    }
    .MuiButton-root {
        padding: .4rem .35rem;
        margin: 0 .25rem .5rem;
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

export const AppBar = styled(MuiAppBar)`
    background-color: transparent !important;
    color: black !important;
    box-shadow: none !important;
    .MuiTab-root {
        min-width: auto !important;
        padding: .4rem 1.5rem;
    }
    .MuiTabs-indicator {
        background-color: ${colors.purple[500]} !important;
    }
    .Mui-selected {
        outline: 0 !important;
        color: ${colors.purple[500]} !important;
    }
    .MuiBadge-root {
        align-items: center;
    }
    .MuiBadge-badge {
        position: relative;
        margin-right: .25rem;
        transform: none;
        color: ${colors.purple[600]} !important;
        background-color: ${colors.purple[100]} !important;
    }
    .MuiTab-wrapper {
        font-size: 1rem !important;
    }
`

export const Tab = withTheme(styled(Button)`
    border-radius: 0 !important;
    border-bottom: 2px solid transparent !important;
    outline: 0 !important;
    
    padding-right: .85rem !important;
    padding-left: .85rem !important;
    
    @media(min-width: 1200px) {
        padding-right: 1.5rem !important;
        padding-left: 1.5rem !important;
    }
    
    .MuiButton-label {
        color:  ${colors.black} !important;
        font-size:  16px !important;
        font-weight: 400;
    }
    
    .MuiBadge-badge {
        font-size:  12px !important;
        font-weight: 600;
    }
    
    &.active {
        border-color: ${colors.purple[500]} !important;
        .MuiButton-label {
            color:  ${colors.purple[500]} !important;
        }
    }
`);

