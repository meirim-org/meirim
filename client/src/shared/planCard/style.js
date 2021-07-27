import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import {
    Card as MuiCard,
    CardMedia as MuiCardMedia,
    CardContent as MuiCardContent,
    CardActionArea as MuiCardActionArea,
} from '@material-ui/core';
import { device } from 'style';

export const Card = withTheme(styled(MuiCard)`
    height: 430px;
    
    @media ${device.mobile} {
        width: 270px;
    }    
    
    @media ${device.tablet} {
        width: 360px;
    }
`);

export const CardMedia = withTheme(styled(MuiCardMedia)`
    position: relative;
    height: 60%;
`);


export const CardActionArea = withTheme(styled(MuiCardActionArea)`
    height: 100%;

    &:focus {
        outline: none;
    }
`);

export const CardContent = withTheme(styled(MuiCardContent)`
    height: 40%;
    font-family: ${props => props.theme.fontFamily} !important;

    > *:first-child {
        font-size: 1.5rem !important;
    }

    > *:last-child {
        font-size: 1rem !important;
        color: ${props => props.theme.palette.black} !important;
    }

`);