import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import LinkIcon from '@material-ui/icons/Link';
import CloseIcon from '@material-ui/icons/Close';
import { device } from 'style';

export const PlanSummaryTitleWrapper = styled.div`
    margin-bottom: .75rem;
`;

export const PlanTermsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 0 -.25rem .75rem;
`;

export const PlanTermWrapper = withTheme(styled.div`
    padding: .25rem;
    > .MuiChip-root {
        height: auto;
        min-height: 1.875rem;
        color: ${props => props.theme.palette.green['text']} !important;  
        background-color: ${props => props.theme.palette.green['bg']} !important;  
    }
`);

export const StatusAndTypeWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 0 -.5rem;

    @media ${device.tablet} {
        margin: 0 -.5rem 0.5rem;
    }
`;

export const StatusWrapper = styled.div`
    padding: 0 0.5rem;
`;

export const TypeWrapper = styled.div`
    padding: 0 0.5rem;
`;

export const LastUpdateDateWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 0 -.5rem 1rem;
    padding: 0 0.5rem;
`;

export const UrlWrapper = styled.div``;

export const CustomLinkIcon = withTheme(styled(LinkIcon)`
    fill: ${props => props.theme.palette.secondary.main} !important;  
    vertical-align: middle;
    margin-right: .5rem;
`);

export const EntryContent = withTheme(styled.div`
    font-family:  ${props => props.theme.fontFamily} !important;
    font-size: 16px;
    line-height: 1.5;
    color: ${props => props.theme.palette.black} !important;  
`);


export const ChartWrapper = styled.div`
    height: 200px;
    margin-top: 1rem;
`;

export const SubscribeIconWrapper = withTheme(styled.div`
    background-color: ${props => props.theme.palette.white};
    position: relative;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    padding: 8px;
    margin: 0 auto .75rem;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08);
    svg {
        position: absolute;
        fill: ${props => props.theme.palette.primary.main} !important;  
    }
`);

export const SubscribeTextWrapper = styled.div`
    text-align: center;
    margin-bottom: 1.25rem;
`;

export const SubscribeButtonsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin: 0 -.75rem;
`;

export const SubscribeButtonWrapper = styled.div`
    padding: 0 .75rem;
`;

export const CloseSubscribeIcon = withTheme(styled(CloseIcon)`
    position: absolute;
    top: .5rem;
    right: .5rem;
    cursor: pointer;
    font-size: 1.3rem !important;
    fill: ${props => props.theme.palette.black} !important;  
    opacity: .8;
`);

export const MapWrapper = withTheme(styled.div`
    height: 8.875rem;
    border-radius: 4px;
    border: solid 1px ${props => props.theme.palette.gray['450']};
    
    > div {
        border-radius: 4px;
    }
`);

export const Datalist = styled.ul`
    padding: 0;
    list-style-position: inside;

    .MuiChip-root {
        height: 26px;
    }
`;


