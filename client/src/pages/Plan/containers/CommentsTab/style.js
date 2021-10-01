import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import { TabPanel } from 'shared';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import {
	FormControl as MuiFormControl, FormControlLabel as MuiFormControlLabel,
	RadioGroup as MuiRadioGroup,
	TextareaAutosize as MuiTextareaAutosize
} from '@material-ui/core';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import { colors } from 'style';

export const CommentsWrapper = styled.div`
    grid-column-start: span 2;
    border-top: 1px solid ${colors.grey[300]};
`

export const AddSubComment = withTheme(styled.div`
    grid-area: add-comment;
    padding: 1rem; 
    text-align: center;
    .MuiSvgIcon-root {
        font-size: 1.125rem !important;
        fill: ${colors.purple[600]} !important;  
        margin: 0 0.75rem; 
    }
    
    .MuiButton-label {
        font-weight: 300;
        font-size: 14px;
        padding: .4rem 0 .4rem .75rem;
        border-radius: 200px;
    }
    
   &.active .MuiButton-label{
        background-color: ${props => props.theme.palette.gray['bg']} !important; 
    }
    
`);


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

export const NewCommentTabPanel = withTheme(styled(TabPanel)`
    &.no-comments {
        margin-bottom: 5.8rem;
    }
`);

export const ButtonWrapper = styled.div`
    margin-bottom: 2rem;
`;

export const CommentIcon = styled(ChatBubbleOutlineIcon)`
    font-size: 1rem !important;
`;

export const NewCommentControl = styled(MuiFormControl)`
    .MuiTypography-root {
        font-size: 0.875rem;
        color: ${colors.black} !important;
    }
    .MuiRadio-colorSecondary {
        color: ${colors.grey[500]} !important;
        &.Mui-checked {
            color: ${colors.purple[700]} !important;
        }
    }
    
    textarea {
        border-color: ${colors.purple[500]} !important;
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 1rem;
    }   
`

export const addCommentButtonWrapper = styled.div`
    margin-bottom: 2rem;
    display: flex;
    justify-content: flex-end;
    
    &.active {
        margin-bottom: 0;
    }
`;

export const RadioGroup = withTheme(styled(MuiRadioGroup)`
    margin: 0 -.5rem;
`);

export const NewCommentLabelWrapper = withTheme(styled.div`
    padding: 0 .5rem;
    
    .MuiButtonBase-root {
        background-color: transparent !important;
        padding: 0.187rem 0.375rem;
    }
`);

export const ErrorWrapper = styled.div`
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(-100%, calc(-50% - .5rem));
    padding: 0 1rem;
`;

export const TextareaAutosize = styled(MuiTextareaAutosize)`
    &[disabled] {
        border-color: ${colors.grey[300]} !important;
        background-color: ${colors.white} !important;
    }
    &:focus {
        outline: 0;
    }
`

export const NewCommentLabel = withTheme(styled(MuiFormControlLabel)`
    border-radius: 4px;
    border: 1px solid transparent;
    margin: 0 0 1rem !important;
    padding: 0 .35rem 0 1rem;
    .MuiSvgIcon-root {
        width: 0.7em;
        height: 0.7em;
    }
    transition: .3s;
    &.active, &:hover {
        background-color: ${props => props.theme.palette.gray['radio']} !important;
    }  
    &.error {
        border-color: ${props => props.theme.palette.red.main} !important;;
    }
`);


export const Like = withTheme(styled.div`
    grid-column-start: span 1;
    padding: 1rem;
    text-align: center;
    position: relative;

    .MuiBadge-badge {
        position: relative;
        margin-right: .25rem;
        transform: none;
        font-weight: 300;
        color: ${colors.black} !important;
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
        background-color: ${colors.grey[300]};
        left: 0;
        top: 50%;
        height: 100%;
        width: 1px;
        transform: translate(-50%,-50%);
    }

`);


export const LikeIcon = styled(ThumbUpAltOutlinedIcon)`
    font-size: 1.15em !important;
    fill: ${colors.purple[600]} !important;  
`