import styled from 'styled-components';
import ArrowForwardIcon  from '@material-ui/icons/ArrowForward';
import { colors } from 'style';

export const ArrowIcon = styled(ArrowForwardIcon)`
    color:  ${colors.black} !important;
`

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