import styled from 'styled-components';
import { device } from 'style';
import { withTheme } from '@material-ui/core/styles';



export const AutocompleteWrapper = withTheme(styled.div`
        background-color: white;
        height: 2.75em;
        border-radius: 12px !important;
        border: 1px solid ${props => props.theme.palette.gray['400']};
        &:hover {
    	    border: solid 1px ${props => props.theme.palette.primary['400']} !important;
        }   
        &:focus-within {
            border: solid 1px ${props => props.theme.palette.primary['400']} !important;
            outline: transparent !important;
        }
        div {
            height: 100%;
            position: relative;
        }
        & > div {
            .MuiInput-underline {
                &:before, &:after {
                 display: none;
                }
            }
            border-radius: 12px !important;
            height: 2.75em;
        }
        input[type] {
            font-family: Assistant !important;
            color: #232323;
            height: 100%;
            font-size: 16px;
            border: 0;
            height: 1.1876em;
            padding: 14px;
        }
        .MuiPaper-root {
            height: auto;
            z-index: 9999;
            width: 100%;
            position: absolute;
            color: rgba(0, 0, 0, 0.87);
            background-color: #fff;
            border-radius: 4px;
        }
`);