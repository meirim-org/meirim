import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';

export const MobileMainWrapper = withTheme(styled.div`
    height: calc(100vh - ${(props) => props.theme.navigation.desktop});
`);

export const Content = withTheme(styled.div`
    background-color: ${(props) => props.theme.palette.gray['bg']};
    box-shadow: -3px 0 24px 0 rgba(0, 0, 0, 0.08);
    overflow-y: auto;
    padding-bottom: 3.75rem;
`);

export const Main = withTheme(styled.main`
    background-color: ${(props) => props.theme.palette.gray['bg']};
    padding: 0 1rem 0.7rem;
    &.no-comments,
    &.new-comment {
        min-height: 100vh;
    }
`);

export const MapaWrapper = styled.div`
    height: 300px;

`
