import styled from 'styled-components';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { withTheme } from '@material-ui/core/styles';
import {
	FormControl as MuiFormControl,
	RadioGroup as MuiRadioGroup,
	TextareaAutosize as MuiTextareaAutosize,
	FormControlLabel as MuiFormControlLabel,
} from '@material-ui/core';
import { TabPanel } from 'shared';
import { device } from 'style';


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

export const addSubCommentWrapper = withTheme(styled.div`
    grid-column-start: span 2;
    padding: 2rem;
    border-top: 1px solid ${props => props.theme.palette.gray['300']};
    
	@media ${device.tablet} {
        padding: 2rem 3.5rem;
    }
`);

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
        padding: 0.4rem 0.375rem;
    }
    
    .MuiFormControlLabel-root {
		padding: 0.1rem !important;
		@media(min-width: 375px) {
			padding: 0.3rem !important;
    	}
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
        border-color: ${props => props.theme.palette.red.main} !important;;
    }
    .MuiSvgIcon-root {
    	width: .9rem !important;
    	height: .9rem !important;
    	
		@media ${device.tablet} {
			width: 1rem !important;
			height: 1rem !important;
		}
    }
`);

export const AddSubComment = withTheme(styled.div`
    grid-column-start: span 1;
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
    
   &.active .MuiButton-label{
        background-color: ${props => props.theme.palette.gray['bg']} !important; 
    }
    
`);

export const CommentIcon = styled(ChatBubbleOutlineIcon)`
    font-size: 1rem !important;
`;
