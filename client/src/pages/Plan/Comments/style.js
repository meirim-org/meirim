import styled from 'styled-components';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { withTheme } from '@material-ui/core/styles'
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import {
    FormControl as MuiFormControl,
    FormControlLabel as MuiFormControlLabel,
    RadioGroup as MuiRadioGroup,
    TextareaAutosize as MuiTextareaAutosize,
} from '@material-ui/core';

export const CommentIcon = styled(ChatBubbleOutlineIcon)`
    font-size: 1rem !important;
`;

export const LikeIcon = withTheme(styled(ThumbUpAltOutlinedIcon)`
    font-size: 1.15em !important;
    fill: ${props => props.theme.palette.primary['600']} !important;  
`);

export const ButtonWrapper = styled.div`
    margin-bottom: 2rem;
`;

export const addCommentButtonWrapper = styled.div`
    margin-bottom: 2rem;
    display: flex;
    justify-content: flex-end;
`;

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

export const ErrorWrapper = styled.div`
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(-100%, calc(-50% - .5rem));
    padding: 0 1rem;
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

export const FormControl = withTheme(styled(MuiFormControl)`
    .MuiTypography-root {
        font-family:  ${props => props.theme.fontFamily} !important;;
        font-size: 0.875rem;
        color: ${props => props.theme.palette.black} !important;
    }
    .MuiRadio-colorSecondary {
        color: ${props => props.theme.palette.gray['main']} !important;
        &.Mui-checked {
            color: ${props => props.theme.palette.primary['700']} !important;
        }
    }
    
    textarea {
        border-color: ${props => props.theme.palette.primary.main} !important;
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 1rem;
    }
`);

export const FormControlLabel = withTheme(styled(MuiFormControlLabel)`
    border-radius: 4px;
    border: 1px solid transparent;
    margin: 0 0 1rem !important;
    padding: 0 .35rem 0 1rem;
    transition: .3s;
    &.active, &:hover {
        background-color: ${props => props.theme.palette.gray['radio']} !important;
    }  
    &.error {
        border-color: ${props => props.theme.palette.red} !important;;
    }
`);

export const RadioGroup = withTheme(styled(MuiRadioGroup)`
    margin: 0 -.5rem;
`);

export const FormControlLabelWrapper = withTheme(styled.div`
    padding: 0 .5rem;
    
    .MuiButtonBase-root {
        background-color: transparent !important;
        padding: 0.187rem 0.375rem;
    }
`);

export const TextareaAutosize = withTheme(styled(MuiTextareaAutosize)`
    &[disabled] {
        border-color: ${props => props.theme.palette.gray['300']} !important;
        background-color: ${props => props.theme.palette.white} !important;
    }
`);









