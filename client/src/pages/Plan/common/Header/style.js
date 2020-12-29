import styled from 'styled-components';
import ArrowForwardIcon  from '@material-ui/icons/ArrowForward';
import { withTheme } from '@material-ui/core/styles';

export const ArrowIcon = withTheme(styled(ArrowForwardIcon)`
        color:  ${props => props.theme.palette.black} !important;
`);