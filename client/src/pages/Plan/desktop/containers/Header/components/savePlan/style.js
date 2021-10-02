import styled from 'styled-components';
import { Button as MuiButton } from '@material-ui/core';
import { colors } from 'style';

export const Button = styled(MuiButton)`
    &.MuiButton-containedPrimary {
        transition: none !important;
        &.active {
        border-color: ${colors.orange[500]} !important;
        background-color: ${colors.orange.contrast} !important;
        }    
    }
`
