import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import { device } from 'style';

export const ShareWrapper = styled.div`
    max-width: 100%;
    min-width: 21.5rem;
    @media ${device.tablet} {
        min-width: 31.5rem; 
    }
`;

export const ShareTitleWrapper =  withTheme(styled.div`
    text-align: center;
    border-bottom: 1px solid ${props => props.theme.palette.gray['radio']};
    
    padding-bottom: 1rem;
    @media ${device.tablet} {
        padding-bottom: 2.5rem;
    }
    > * {
        font-size: 24px !important;
        @media ${device.tablet} {
           font-size: 32px !important;
           font-weight: 600 !important;
        }
    }
`);

export const ShareActionWrapper =  withTheme(styled.div`
    padding: 1.5rem 2.2rem;
    text-align: center;
    @media ${device.tablet} {
       padding: 2rem 3.75rem;
    }
    > * {
        font-size: 16px !important;
        @media ${device.tablet} {
           font-size: 14px !important;
        }
    }
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
        min-height: 3rem;
        @media ${device.tablet} {
            min-height: 3.7em;
        }
    }

    .MuiButton-label {
        text-transform: capitalize;
    }

`);

export const ShareTextWrapper = styled.div`
    margin-bottom: 1rem;
    text-align: center;
    
    > * {
        font-size: 12px !important;
        @media ${device.tablet} {
           font-size: 14px !important;
        }
    }
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
        font-size: 12px !important;  
        max-width: 11.8rem;              
        @media ${device.tablet} {
           max-width: 17rem; 
           font-size: 14px !important;
        }        
    }
`);



