import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { withTheme } from '@material-ui/core/styles';
import { Container, List, Drawer as MUIDrawer, ListItem, ListItemIcon, Button } from '@material-ui/core';
import { colors } from 'style';

export const StyledList = styled(List)`
    padding: 0 !important;
`;

export const StyledListItem = styled(ListItem)`
    padding: 1.2rem 3.5rem !important; 
    color: ${colors.black} !important;
    .MuiListItemText-root {
      flex: none;
    }
    .MuiListItemIcon-root {
      margin: 0 .75rem;
      min-width: auto;
      color: ${props => props.color} !important;
    }
    span {
        font-size: 18px;      
    }
    &#logout-button {
         color: ${colors.red[600]} !important;
    }
    &#my-plans-button {
         color: ${colors.purple[500]} !important;
    }
    &#register-button {
         color: ${colors.purple[500]} !important;
    }
    &.active {
        color: ${colors.purple[500]} !important;
    }
`

export const StyledLink = styled(NavLink)`
    font-size: 16px;
    color: ${colors.black};
    transition: 0.3s;

    &:hover, &.active {
        text-decoration: none;
        color: ${colors.purple[500]};
    }
`

export const DesktopHeader = styled.header`
    position: fixed;
    z-index: 999;
    background-color: ${colors.white};
    padding: .75rem 4.8rem;
    border-bottom: 1px solid ${colors.grey[300]};   
    top: 0;
    right: 0;
    left: 0;
`

export const MobileHeader = styled.header`
    position: fixed;
    z-index: 999;
    background-color: ${colors.white};
    padding: .75rem 1.5rem .75rem .65rem;
    border-bottom: 1px solid ${colors.grey[300]};   
    top: 0;
    right: 0;
    left: 0;
`

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

export const StyledStarIcon = styled(ListItemIcon)`
  path {
    color: ${colors.purple[500]};
  }
`

export const Logo = styled.img`
    max-width: 53px;
    height: auto;
`;

export const Drawer = styled(MUIDrawer)`
    z-index: 9999 !important;
`;

export const MenuWrapper = styled.div`
    .MuiButtonBase-root {
        .MuiSvgIcon-root {
            transition: .3s;
        }
        .MuiButton-label {
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
`

export const MyPlansButton = styled(Button)`
    line-height: 1.5 !important;
    .MuiButton-label {
        font-size: 16px;      
        text-decoration: none;
    }
    .MuiButton-startIcon {
        color: ${colors.purple[500]};
        margin-left: 2px;
        margin-right: -4px;
    }
`
