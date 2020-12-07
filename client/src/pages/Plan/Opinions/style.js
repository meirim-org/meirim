import styled from 'styled-components';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { withTheme } from '@material-ui/core/styles'
import {
    FormControl as MuiFormControl,
    FormControlLabel as MuiFormControlLabel,
    RadioGroup as MuiRadioGroup,
    TextareaAutosize as MuiTextareaAutosize,
} from '@material-ui/core';

export const CommentIcon = styled(ChatBubbleOutlineIcon)`
    font-size: 1rem !important;
`;

export const ButtonWrapper = styled.div`
    margin-bottom: 2rem;
    
    &.no-opinions {
        margin-bottom: 7.8rem;
    }
`;

export const addOpinionButtonWrapper = styled.div`
    margin-bottom: 2rem;
    display: flex;
    justify-content: flex-end;
`;

export const ErrorWrapper = styled.div`
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(-100%, calc(-50% - .5rem));
    padding: 0 1rem;
`;


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


export const NoOpinionsWrapper = withTheme(styled.div`
    text-align: center;
`);









