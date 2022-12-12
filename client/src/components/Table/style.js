import styled from 'styled-components';
import { Input as MuiInput } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import { device } from '../../style';

export const Table = styled.table`
   margin: 0 auto;
   margin-top: 50px;

   border-collapse: separate;
   border-spacing: 0;
`;

export const TableBody = styled.tbody`
    margin-top:100px;
`;

export const Row = styled.tr`
`;

export const Cell = styled.td`
    text-align: center;
    padding:20px;
`;

export const TableHead = styled.thead`
    
`;

export const HeaderRow = styled.tr`
`;

export const HeaderCell = styled.th`
    padding:10px;

    border-top: 1px solid #D0D0D0;
    border-bottom: 1px solid #D0D0D0;

    &:first-child {
        border: 1px solid #D0D0D0;
        border-left: none;

        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
    }

    &:last-child {
        border: 1px solid #D0D0D0;
        border-right: none;

        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
    }
   
    &:not(:last-child) {
        border-left: 1px solid #652DD0;
    }

`;