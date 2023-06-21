import styled from 'styled-components';
import { device } from '../../style';
import { withTheme } from '@material-ui/core/styles';

export const ChildrenWrapper = withTheme(styled.div`
    position: relative;
    z-index: 1;
    padding-top: ${props => props.theme.navigation.mobile};
    @media ${device.tablet} {
       padding-top: ${props => props.theme.navigation.desktop};
    }
    @media screen and (max-width: 361px) {
        padding-top: 120px;
    }
`);

export const Wrapper = withTheme(styled.div`
    background: ${props => props.theme.palette.gray.bg};
    min-height: 100vh;
`);
