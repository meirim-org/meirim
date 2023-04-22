import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';

export const PageWrapper = withTheme(styled.div`
    margin-top: 100px;
    min-height: calc(100vh - 320px);
`)

export const NoContent = withTheme(styled.div`
    text-align: center;
    > * {
        text-align: center;
    }
`)