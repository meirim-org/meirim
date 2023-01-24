import styled from 'styled-components';
// import { Input as MuiInput } from '@material-ui/core';
// import { withTheme } from '@material-ui/core/styles';
// import { device } from '../../style';

export const Table = styled.table`
   margin: 0 auto;
   margin-top: 50px;

   border-collapse: separate;
   border-spacing: 0;

   width: 80%;
`;

export const TableHead = styled.thead`
`;

export const HeaderRow = styled.tr`
`;

export const HeaderCellSortable = styled.div`
    cursor: ${props => props.sortable ? 'pointer' : 'initial'};
    text-align: center;
    user-select: none;

    display: flex;
    flex-direction: row;
`;

export const CellContent = styled.div`
    text-align: center;
    flex-grow: 1;
    
`;

export const CellSep = styled.div`
    display: flex;
    align-self: flex-end;
    color:#652DD0;
`;

export const HeaderCell = styled.th`
    padding-top: 20px;
    padding-bottom: 20px;

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
`;

export const TableBody = styled.tbody`
    background-color: #FFFFFF;
    width: 100%;
`;

export const RowSpacer = styled.tr`
    height: 30px;
`;

export const Row = styled.tr`
    background-color: #FCFAFF;
`;

export const Cell = styled.td`
    text-align: center;
    padding:24px;
    
`;