import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"
import React from "react"
import * as SC from './style';

const Table = ({ columns, data }) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <SC.Table>
            <SC.TableHead>
                {table.getHeaderGroups().map(headerGroup => (
                    <SC.HeaderRow key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <SC.HeaderCell key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </SC.HeaderCell>
                        ))}
                    </SC.HeaderRow>
                ))}
            </SC.TableHead>
            <SC.TableBody>
                {table.getRowModel().rows.map(row => (
                    <SC.Row key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <SC.Cell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </SC.Cell>
                        ))}
                    </SC.Row>
                ))}
            </SC.TableBody>
        </SC.Table>
    )
}

export default Table