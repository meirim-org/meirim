import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';

export const ShareWrapper = styled.div`
    min-width: 31.5rem;
    max-width: 100%;
`;

export const ShareTitleWrapper =  withTheme(styled.div`
    text-align: center;
    padding-bottom: 2.5rem;
    border-bottom: 1px solid
`);

export const ShareActionWrapper =  withTheme(styled.div`
    padding: 2rem 3.75rem;
    text-align: center;
`);

export const ShareButtonWrapper = withTheme(styled.div`
    margin-bottom: 1rem;
    .MuiButton-root {
        width: 100%;
        border: transparent!important;
        background-color: ${props => props.theme.palette.green['whatsapp']} !important;
        &:hover, &:focus {
            background-color: ${props => props.theme.palette.green['whatsapp']} !important;
            outline: 0 !important;
        }
    }

    .MuiButton-label {
        text-transform: capitalize;
    }
`);

export const ShareTextWrapper = styled.div`
    margin-bottom: 1rem;
    text-align: center;
`;

export const CopyUrlArea = withTheme(styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color: ${props => props.theme.palette.gray['bg']} !important;
    align-items: center;
    padding: 1rem;
    border-radius: 12px;
    border: solid 1px ${props => props.theme.palette.gray['400']} !important;

    > span {
        direction: ltr;
        white-space: nowrap;
        overflow-x: scroll;
        max-width: 17rem; 
    }
`);



