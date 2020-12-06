import styled from "styled-components";
import {withTheme} from "@material-ui/core/styles";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";

export const Header = styled.span`
    grid-area: header; 
    padding: 2rem 2rem 0;
    margin-bottom: 0.8rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 -1rem .8rem;
`;

export const FirstSide = withTheme(styled.div`
    > * {
        padding: 0 1rem;
        position: relative;
        &:not(:last-child):after {
            content: '|';
            position: absolute;
            color: ${props => props.theme.palette.gray['300']};
            left: 0;
            top: 50%;
            transform: translate(-50%,-50%);
        }
    }
`);

export const SecondSide = styled.div`
    > * {
        padding: 0 1rem;
    }
`;

export const Text = withTheme(styled.div`
    grid-area: text; 
    padding: 0 2rem 1rem;
    margin: 0;
    border-bottom: 1px solid ${props => props.theme.palette.gray['300']};
`);

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

export const AddComment = withTheme(styled.div`
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
    }
`);

export const LikeIcon = withTheme(styled(ThumbUpAltOutlinedIcon)`
    font-size: 1.15em !important;
    fill: ${props => props.theme.palette.primary['600']} !important;  
`);

export const CommentIcon = styled(ChatBubbleOutlineIcon)`
    font-size: 1rem !important;
`;