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

    && {
        box-shadow: 0px 24px 32px rgba(0, 0, 0, 0.04),
            0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04),
            0px 0px 1px rgba(0, 0, 0, 0.04);
        border-radius: 12px;
    }

    @media ${device.mobile} {
        max-width: 270px;
    }

    @media ${device.tablet} {
        max-width: 360px;
    }

    @media screen and (max-width: 600px) {
        margin: 0 auto;
    }

    .MuiCardContent-root:last-child {
        padding-bottom: 16px;
    }
`);

export const CardMedia = withTheme(styled(MuiCardMedia)`
    position: relative;
    height: 50%;
`);

export const CardActionArea = withTheme(styled(MuiCardActionArea)`
    height: 100%;

    &:focus {
        outline: none;
    }
`);

export const CardContent = withTheme(styled(MuiCardContent)`
    height: 50%;
    position: relative;
    font-family: ${(props) => props.theme.fontFamily} !important;
    display: flex;
    flex-direction: column;

    > *:first-child {
        font-size: 1.5rem !important;
    }

    > *:last-child {
        font-size: 1rem !important;
        color: ${(props) => props.theme.palette.black} !important;
    }
`);
