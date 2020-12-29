import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import {
	FormControl as MuiFormControl,
	RadioGroup as MuiRadioGroup,
	TextareaAutosize as MuiTextareaAutosize,
	FormControlLabel as MuiFormControlLabel,
} from '@material-ui/core';
import { TabPanel } from 'shared';


export const FormControl = withTheme(styled(MuiFormControl)`
    margin-bottom: 1rem !important;
    textarea {
        width: 100%;
        padding: 1rem;
        border-radius: 4px;
        border-color: ${props => props.theme.palette.gray['400']} !important;  
        
        &:focus {
             outline: none;
             border-color: ${props => props.theme.palette.primary['600']} !important;
        }
    }   
`);

export const addSubCommentWrapper = styled.div`
    padding: 2rem 3.5rem;
`;

export const addCommentButtonWrapper = styled.div`
    margin: 0 -0.6rem 2rem;
    display: flex;
    justify-content: flex-end;
    
    &.active {
        margin-bottom: 0;
    }
`;

export const ErrorWrapper = styled.div`
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(-100%, calc(-50% - .5rem));
    padding: 0 1rem;
`;


export const NewCommentControl = withTheme(styled(MuiFormControl)`
    .MuiTypography-root {
        font-family:  ${props => props.theme.fontFamily} !important;
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
        border-color: ${props => props.theme.palette.gray['400']} !important;  
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 1rem;
        
        &:focus {
            outline: none;
            border-color: ${props => props.theme.palette.primary['600']} !important;
        }
    }   

`);

export const NewCommentTabPanel = withTheme(styled(TabPanel)`
    &.no-comments {
        margin-bottom: 5.8rem;
    }
`);

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

export const TextareaAutosize = withTheme(styled(MuiTextareaAutosize)`
    &[disabled] {
        border-color: ${props => props.theme.palette.gray['300']} !important;
        background-color: ${props => props.theme.palette.white} !important;
    }
`);

export const NewCommentLabel = withTheme(styled(MuiFormControlLabel)`
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

