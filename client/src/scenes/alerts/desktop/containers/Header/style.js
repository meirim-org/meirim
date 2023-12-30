import styled from 'styled-components';
import { AppBar as MuiAppBar, Button } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';

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
    padding: 2rem 4.8rem 0;
    border-bottom: 1px solid ${(props) => props.theme.palette.gray['300']};
`);

export const TitlesAndTabs = styled.div``;

export const AppBar = withTheme(styled(MuiAppBar)`
    background-color: transparent !important;
    color: black !important;
    box-shadow: none !important;
    .MuiTab-root {
        min-width: auto !important;
        padding: 0.4rem 1.5rem;
    }
    .MuiTabs-indicator {
        background-color: ${(props) =>
            props.theme.palette.primary.main} !important;
    }
    .Mui-selected {
        outline: 0 !important;
        color: ${(props) => props.theme.palette.primary.main} !important;
    }
    .MuiBadge-root {
        align-items: center;
    }
    .MuiBadge-badge {
        position: relative;
        margin-right: 0.25rem;
        transform: none;
        color: ${(props) => props.theme.palette.primary['600']} !important;
        background-color: ${(props) =>
            props.theme.palette.primary['bg']} !important;
    }
    .MuiTab-wrapper {
        font-size: 1rem !important;
    }
`);

export const TabWrapper = styled.div`
    display: flex;
`;

export const PlaneName = withTheme(styled.p`
    margin-right: auto;
    color: ${(props) => props.theme.palette.primary.main} !important;
    font-family: ${(props) => props.theme.fontFamily} !important;
    font-size: 16px !important;
    font-weight: 600;
    line-height: 24px;
`);

export const Tab = withTheme(styled(Button)`
    border-radius: 0 !important;
    border-bottom: 2px solid transparent !important;
    outline: 0 !important;

    padding-right: 0.85rem !important;
    padding-left: 0.85rem !important;

    @media (min-width: 1200px) {
        padding-right: 1.5rem !important;
        padding-left: 1.5rem !important;
    }

    .MuiButton-label {
        color: ${(props) => props.theme.palette.black} !important;
        font-size: 16px !important;
        font-weight: 400;
    }

    .MuiBadge-badge {
        font-family: ${(props) => props.theme.fontFamily} !important;
        font-size: 12px !important;
        font-weight: 600;
    }

    .MuiBadge-invisible {
        display: none;
    }

    &.active {
        border-color: ${(props) => props.theme.palette.primary.main} !important;
        .MuiButton-label {
            color: ${(props) => props.theme.palette.primary.main} !important;
        }
    }
`);
