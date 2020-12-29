import styled from 'styled-components';
import { AppBar as MuiAppBar } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';

export const MobileMainWrapper = styled.div`
    height: calc(100vh - 79px);
`;

export const Content = styled.div`
    box-shadow: -3px 0 24px 0 rgba(0, 0, 0, 0.08);
    overflow-y: auto;
    padding-bottom: 3.75rem;
`;

export const AddSubComment = withTheme(styled.div`
    grid-area: add-comment;
    padding: 1rem; 
    text-align: center;
    .MuiSvgIcon-root {
        font-size: 1.125rem !important;
        fill: ${props => props.theme.palette.primary['600']} !important;  
        margin: 0 0.75rem; 
    }
    
    .MuiButton-label {
        font-weight: 300;
        font-size: 14px;
        padding: .4rem 0 .4rem .75rem;
        border-radius: 200px;
    }
    
   &.active {
       .MuiButton-label{
            background-color: ${props => props.theme.palette.gray['bg']} !important; 
        }
        + div > div:first-child {
            padding: 2rem;
        }
   }
    
`);

export const CommentIcon = styled(ChatBubbleOutlineIcon)`
    font-size: 1rem !important;
`;

export const CommentsWrapper = withTheme(styled.div`
    grid-area: comments; 
    border-top: 1px solid ${props => props.theme.palette.gray['300']};
    
    
    
`);

export const SubCommentForm = withTheme(styled.div`
    grid-area: comments; 
    border-top: 1px solid ${props => props.theme.palette.gray['300']};
`);

export const Header = withTheme(styled.div`
    display: grid;
    grid-template-columns: 49% 1fr;
    padding: 1rem 4.8rem 0 1.2rem;
    border-bottom: 1px solid ${props => props.theme.palette.gray['300']};
`);

export const Main = withTheme(styled.main`
    background-color:  ${props => props.theme.palette.gray['bg']};
    padding: 2rem 1rem;
    &.no-comments, &.new-comment{
        height: 100%;
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

export const Like = withTheme(styled.div`
    grid-area: like; 
    padding: 1rem;
    text-align: center;
    position: relative;

    .MuiBadge-badge {
        position: relative;
        margin-right: .25rem;
        transform: none;
        font-weight: 300;
        color: ${props => props.theme.palette.black} !important;
        background-color: ${props => props.theme.palette.gray['200']} !important;
        font-size: 14px !important;
        padding: 0.6rem;
    }
    
    .MuiButton-label {
       font-weight: 300;
       font-size: 14px;
    }
    
   .MuiSvgIcon-root {
       margin: 0 0.75rem; 
       font-size: 1.125rem !important;
    }
    
    &:after {
        content: '';
        position: absolute;
        background-color: ${props => props.theme.palette.gray['300']};
        left: 0;
        top: 50%;
        height: 100%;
        width: 1px;
        transform: translate(-50%,-50%);
    }

`);


export const LikeIcon = withTheme(styled(ThumbUpAltOutlinedIcon)`
    font-size: 1.15em !important;
    fill: ${props => props.theme.palette.primary['600']} !important;  
`);