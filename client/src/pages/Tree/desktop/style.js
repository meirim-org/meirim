import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';

export const MainWrapper = styled.div`
    display: grid;
    grid-template-columns: 60% 1fr;
    grid-template-rows: 1fr;
    overflow: hidden;
    height: calc(100vh - 72px);
`;

export const Content = withTheme(styled.div`
    background-color:  ${props => props.theme.palette.gray['bg']};
    box-shadow: -3px 0 24px 0 rgba(0, 0, 0, 0.08);
    overflow-y: auto;
    
    header {
        background-color:  ${props => props.theme.palette.white};
    }
`);

export const Main = withTheme(styled.main`
    padding: 2.5rem 4.8rem;
    &.no-comments {
        height: 100%;
        min-height: 100vh;
    }
`);