import styled from 'styled-components';
import ArrowForwardIcon  from '@material-ui/icons/ArrowForward';
import { withTheme } from '@material-ui/core/styles';

export const ArrowIcon = withTheme(styled(ArrowForwardIcon)`
        color:  ${props => props.theme.palette.black} !important;
`);

export const DateAndTypeWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 0 -.5rem 1rem;
`;

export const DateWrapper = styled.div`
    padding: 0 0.5rem
`;

export const TypeWrapper = styled.div`
    padding: 0 0.5rem
`;