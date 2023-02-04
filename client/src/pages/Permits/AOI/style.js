import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import TrashCanIcon from 'shared/icons/TrashCanIcon';
import { IconButton } from 'shared';

export const Layout = styled.div`
    margin-top: 70px;
    display: flex;
    flex-direction: row;
`

export const Sidebar = styled.div`
    width: 310px;
    background-color: #FFFFFF;
    padding-top: 46px;
    min-height: 100vh;
    box-shadow: -2px 0px 13px rgba(0, 0, 0, 0.08);
    padding: 16px;
`

export const List = styled.ul`
    padding: 16px 0 0 0;
`

export const Item = withTheme(styled.li`
    display: flex;
    flex-direction: row;
    align-items:center;
    list-style: none;
    background-color: #FCFAFF;
    border-radius: 10px;
    color: #AFAFAF;
    font-size: 20px;
    font-weight: 600;
    line-height: 26px;
    margin-bottom: 25px;
    padding: 27px;
    padding-right: 25px;

    &:hover{
        color: ${props => props.theme.palette.primary.main};
    }

    &.active {
        background-color: ${props => props.theme.palette.primary.main};
        color: ${props => props.theme.palette.white};

        &.${StyledTrashCanIcon}{
            color: red;
        }

        padding: 16px;
        padding-right: 25px;
    }

    
`)

export const ItemLabel = withTheme(styled.p`
    margin: 0;
    padding: 0;
    display: flex;
    flex-grow: 1;
`)

export const DeleteButton = withTheme(styled(IconButton)`
    border:none;
    background: none;
    padding:0;
    display: flex;
`)

export const StyledTrashCanIcon = withTheme(styled(TrashCanIcon)`
    color: ${props => props.theme.palette.white};
`)

export const Content = styled.section`
    padding: 32px;
`