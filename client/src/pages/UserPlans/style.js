import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';


export const TitleWrapper = withTheme(styled.div`
    margin-bottom: 1rem;
`);

export const NoPlansContent = withTheme(styled.div`
background: red;
    text-align: center;
    padding: 0 1rem;
    > * {
        text-align: center;
    }
    min-height: calc(100vh -  ${props => props.theme.navigation.desktop});
`);
