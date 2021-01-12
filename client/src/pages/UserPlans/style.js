import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';


export const TitleWrapper = withTheme(styled.div`
    margin-bottom: 1rem;
`);

export const NoPlansContent = withTheme(styled.div`
    text-align: center;
    padding-top: 8rem;
    > * {
        text-align: center;
    }
    min-height: calc(100vh -  ${props => props.theme.navigation.desktop});
`);
