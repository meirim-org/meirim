import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import {
	FormControl as MuiFormControl,
} from '@material-ui/core';
import { device } from 'style';


export const addSubCommentWrapper = styled.div`
    padding: 2rem;
    @media ${device.laptop} {
        padding: 2rem 3.5rem;
    }
`;

export const FormControl = withTheme(styled(MuiFormControl)`
    margin-bottom: 1rem !important;
    textarea {
        width: 100%;
        padding: 1rem;
        border-radius: 4px;
        border-color: ${props => props.theme.palette.gray['600']} !important;  
        
        &:focus {
            outline-color: ${props => props.theme.palette.primary['600']} !important;
        }
    }   
`);


export const addCommentButtonWrapper = styled.div`
    margin-bottom: 2rem;
    display: flex;
    justify-content: flex-end;
    
    &.active {
        margin-bottom: 0;
    }
`;