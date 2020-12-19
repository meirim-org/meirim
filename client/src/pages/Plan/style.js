import styled from 'styled-components';
import { device } from '../../style';
import { AppBar as MuiAppBar } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';

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
    border-bottom: 1px solid ${props => props.theme.palette.gray['300']};
`);

export const Main = withTheme(styled.main`
    background-color:  ${props => props.theme.palette.gray['bg']};
    padding: 2.5rem 4.8rem;
    &.no-comments {
        height: 100vh;
    }
`);

export const AppBar = withTheme(styled(MuiAppBar)`
    background-color:  transparent !important;
    color: black !important;
    box-shadow: none !important;
    .MuiTab-root {
        min-width: auto !important;
        padding: .4rem 1.5rem;
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
        padding: 0 .25rem;
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

export const NoComments = styled.div`
    text-align: center;
`;

export const NoCommentsBold = styled.span`
    font-size: 1.125rem;
    font-weight: 600;
`;

export const NoCommentsRegular = styled.span`
    font-size: 1rem;
`;

export const ShareWrapper = styled.div`
    min-width: 31.5rem;
    max-width: 100%;
`;

export const ShareTitleWrapper =  withTheme(styled.div`
    text-align: center;
    padding-bottom: 2.5rem;
    border-bottom: 1px solid
`);

export const ShareActionWrapper =  withTheme(styled.div`
    padding: 2rem 3.75rem;
    text-align: center;
`);

export const ShareButtonWrapper = withTheme(styled.div`
    margin-bottom: 1rem;
    .MuiButton-root {
        width: 100%;
        border: transparent!important;
        background-color: ${props => props.theme.palette.green['whatsapp']} !important;
        &:hover, &:focus {
            background-color: ${props => props.theme.palette.green['whatsapp']} !important;
            outline: 0 !important;
        }
    }

    .MuiButton-label {
        text-transform: capitalize;
    }
`);

export const ShareTextWrapper = styled.div`
    margin-bottom: 1rem;
    text-align: center;
`;


export const CopyUrlArea = withTheme(styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color: ${props => props.theme.palette.gray['bg']} !important;
    align-items: center;
    padding: 1rem;
    border-radius: 12px;
    border: solid 1px ${props => props.theme.palette.gray['400']} !important;

    > span {
        direction: ltr;
        white-space: nowrap;
        overflow-x: scroll;
        max-width: 17rem; 
    }
`);



