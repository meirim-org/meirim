import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import {
	Card as MuiCard,
	CardMedia as MuiCardMedia,
	CardContent as MuiCardContent,
	CardActionArea as MuiCardActionArea,
} from '@material-ui/core';
import { colors } from 'style';

export const Card = withTheme(styled(MuiCard)`
   height: 504px;
`);

export const CardMedia = withTheme(styled(MuiCardMedia)`
   height: 60%;
`);

export const CardActionArea = withTheme(styled(MuiCardActionArea)`
   height: 100%;
   &:focus {
     outline: none;
   }
`);

export const CardContent = styled(MuiCardContent)`
   height: 40%;
   > *:first-child {
        font-size:  1.5rem !important;
   }
   > *:last-child {
        font-size:  1rem !important;
        color: ${colors.black} !important;
   }
`