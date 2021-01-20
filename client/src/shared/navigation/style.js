import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { withTheme } from '@material-ui/core/styles';
import { Container, List, Drawer as MUIDrawer, ListItem, ListItemIcon, Button } from '@material-ui/core';

export const StyledList = styled(List)`
    padding: 0 !important;
`;

export const StyledListItem = withTheme(styled(ListItem)`
    padding: 1.2rem 3.5rem !important; 
    color: ${props => props.theme.palette.black} !important;
    .MuiListItemText-root {
      flex: none;
    }
    .MuiListItemIcon-root {
      margin: 0 .75rem;
      min-width: auto;
      color: ${props => props.color} !important;
    }
    span {
        font-family:  ${props => props.theme.fontFamily} !important;
        font-size: 18px;      
    }
    &#logout-button {
         color: ${props => props.theme.palette.red.alt} !important;
    }
    &#my-plans-button {
         color: ${props => props.theme.palette.primary.main} !important;
    }
    &#register-button {
         color: ${props => props.theme.palette.primary.main} !important;
    }
    &.active {
        color: ${props => props.theme.palette.primary.main} !important;
    }
`);

export const StyledLink = withTheme(styled(NavLink)`
    font-family:  ${props => props.theme.fontFamily} !important;
    font-size: 16px;
    color: ${props => props.theme.palette.black};
    transition: 0.3s;

    &:hover, &.active {
        text-decoration: none;
        color: ${props => props.theme.palette.primary.main};
    }
`);

export const DesktopHeader = withTheme(styled.header`
    position: fixed;
    z-index: 999;
    background-color: ${props => props.theme.palette.white};
    padding: .75rem 4.8rem;
    border-bottom: 1px solid ${props => props.theme.palette.gray['300']};   
    top: 0;
    right: 0;
    left: 0;
`);

export const MobileHeader = withTheme(styled.header`
    position: fixed;
    z-index: 999;
    background-color: ${props => props.theme.palette.white};
    padding: .75rem 1.5rem .75rem .65rem;
    border-bottom: 1px solid ${props => props.theme.palette.gray['300']};   
    top: 0;
    right: 0;
    left: 0;
`);

export const StyledContainer = styled(Container)`
    max-width: none !important;
    padding: 0 !important;
`;


export const MobileNavWrapper = styled.div`
    width: 250px;
`;

export const LogOutIcon = withTheme(styled(ListItemIcon)`
  path {
    color: ${props => props.theme.palette.gray['400']};
  }
`);

export const StyledStarIcon = withTheme(styled(ListItemIcon)`
  path {
    color: ${props => props.theme.palette.primary.main};
  }
`);

export const Logo = styled.img`
    max-width: 53px;
    height: auto;
`;

export const Drawer = styled(MUIDrawer)`
    z-index: 9999 !important;
`;

export const MenuWrapper = withTheme(styled.div`
    .MuiButtonBase-root {
        .MuiSvgIcon-root {
            color: ${props => props.theme.palette.blue.main};
            transition: .3s;
        }
        .MuiButton-label {
            font-family:  ${props => props.theme.fontFamily} !important;
            color: ${props => props.theme.palette.blue.main};
            font-size: 16px;      
            text-decoration: none;
            line-height: 1.5 !important;
        }
        &:hover, &:focus {
            outline: 0;
        }
        .MuiButton-endIcon {
            margin-left: -4px;
            margin-right: 2px;
        }
    }
`);

export const MyPlansButton = withTheme(styled(Button)`
    line-height: 1.5 !important;
    .MuiButton-label {
        font-family:  ${props => props.theme.fontFamily} !important;
        color: ${props => props.theme.palette.blue.main};
        font-size: 16px;      
        text-decoration: none;
    }
    .MuiButton-startIcon {
        color: ${props => props.theme.palette.primary.main};
        margin-left: 2px;
        margin-right: -4px;
    }
`);


