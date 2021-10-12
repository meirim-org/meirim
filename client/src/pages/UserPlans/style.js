import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import { colors } from 'style';

export const TitleWrapper = styled.div`
    margin-bottom: 1rem;
    padding-top: 2rem;
`

export const NoPlansContent = withTheme(styled.div`
    text-align: center;
    padding-top: 8rem;
    > * {
        text-align: center;
    }
    min-height: calc(100vh -  ${props => props.theme.navigation.desktop});
    
    svg {
        width: 54px;
        height: auto;
        path {
            &:first-child {
                fill: ${colors.orange[100]} !important;
            }
            &:last-child {
                fill: ${colors.orange[500]} !important;
                stroke: ${colors.orange[500]} !important;
            }
        }           
    }
`);

export const PlansContent = withTheme(styled.div`
    min-height: calc(100vh -  ${props => props.theme.navigation.desktop});
`);
