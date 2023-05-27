import { useReactTable, getCoreRowModel, flexRender, getSortedRowModel } from "@tanstack/react-table"
import React from "react"
import * as SC from './style';

const Table = ({ accessory, options, columns, data, defaultSorting }) => {
    const initSorting = defaultSorting && [{ id: defaultSorting, desc: false }]
    const [sorting, setSorting] = React.useState(initSorting)

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting
        },
        enableSortingRemoval: false,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: defaultSorting && setSorting,
    })

    return (
        <SC.Table>
            <SC.TableHead>
                {table.getHeaderGroups().map(headerGroup => (
                    <SC.HeaderRow key={headerGroup.id}>
                        {headerGroup.headers.map((header, index) => (
                            <SC.HeaderCell key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : (
                                        <SC.HeaderCellSortable sortable={header.column.getCanSort()}
                                            onClick={header.column.getToggleSortingHandler()}>
                                            <SC.CellContent align={options?.align}>
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            </SC.CellContent>
                                            {index !== headerGroup.headers.length - 1 && <SC.CellSep>|</SC.CellSep>}
                                        </SC.HeaderCellSortable>
                                    )}
                            </SC.HeaderCell>
                        ))}
                    </SC.HeaderRow>
                ))}
            </SC.TableHead>
            <SC.TableBody>
                {table.getRowModel().rows.map((row, index) => (
                    <React.Fragment key={row.id}>
                        {index === 0 && <SC.RowSpacer />}
                        <SC.Row key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <SC.Cell key={cell.id} align={options?.align}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </SC.Cell>
                            ))}
                            {accessory &&
                                <SC.AccessoryCell>
                                    {accessory(row.original)}
                                </SC.AccessoryCell>
                            }
                        </SC.Row>
                        <SC.RowSpacer />
                    </React.Fragment>
                ))}
            </SC.TableBody>
        </SC.Table>
    )
}

export default Table