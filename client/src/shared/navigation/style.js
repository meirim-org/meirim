import styled from 'styled-components';
import { NavLink, Link } from 'react-router-dom';
import { colors } from '../../style/index';
import { Container, List, Drawer as MUIDrawer, ListItem, ListItemIcon } from '@material-ui/core';

export const StyledList = styled(List)`
    padding: 0 !important;
`;

export const StyledListItem = styled(ListItem)`
    padding: 1.2rem 3.5rem !important;  
    color: ${props => props.color}!important;
    .MuiListItemText-root {
      flex: none;
    }
    .MuiListItemIcon-root {
      margin: 0 .75rem;
      min-width: auto;
    }
    span {
        font-family: Assistant !important;
        font-size: 18px;      
    }
`;

export const StyledLink = styled(NavLink)`
    font-family: Assistant !important;
    font-size: 16px;
    color: ${colors.black};
    transition: 0.3s;

    &:hover, &.active {
        text-decoration: none;
    }
`;

export const StyledHeader = styled.header`
    position: fixed;
    z-index: 999;
    background-color: ${colors.white};
    padding: .75rem 0;
    border-bottom: 1px solid ${colors.gray.light};   
    top: 0;
    right: 0;
    left: 0;
`;

export const StyledContainer = styled(Container)`
    max-width: 1376px !important;
`;


export const MobileNavWrapper = styled.div`
    width: 250px;
`;

export const LogOutIcon = styled(ListItemIcon)`
  path {
    color: #d1ccd5;
  }
`;

export const StyledStarIcon = styled(ListItemIcon)`
  path {
    color: #652dd0;
  }
`;

export const Logo = styled.img`
    max-width: 53px;
    height: auto;
`;

export const Drawer = styled(MUIDrawer)`
    z-index: 9999 !important;
`;

