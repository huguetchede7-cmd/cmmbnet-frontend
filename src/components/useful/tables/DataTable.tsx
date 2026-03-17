"use client"

import * as React from "react"
import {
    ColumnDef,
    SortingState,
    VisibilityState,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckIcon, MoreHorizontal } from "lucide-react"
import { ColumnVisibilityMenu } from "@/components/tables/ColumnVisibilityMenu"
import { cn } from "@/lib/utils"

type FilterOption = {
    id: string
    label: string
    options: string[]
}

type RowAction<TData> = {
    label: string
    icon?: React.ElementType
    variant?: "default" | "destructive" | "outline"
    onClick: (row: TData) => void
}

type BulkAction<TData> = {
    label: string
    icon?: React.ElementType
    variant?: "default" | "destructive" | "outline"
    onClick: (rows: TData[]) => void
}

interface DataTableProps<TData, TValue> {
    data: TData[]
    columns: ColumnDef<TData, TValue>[]
    searchableColumn?: string
    filters?: FilterOption[]
    actions?: RowAction<TData>[]
    onClick?: (item: TData) => undefined
    bulkActions?: BulkAction<TData>[]
    selectable?: boolean
}

export function DataTable<TData, TValue>({
    data,
    columns,
    searchableColumn,
    filters = [],
    actions = [],
    bulkActions = [],
    selectable = false,
    onClick = undefined,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [searchInputValue, setSearchInputValue] = React.useState<string>("")

    // --- Ensure instant filtering by syncing searchInputValue and columnFilters ---
    React.useEffect(() => {
        if (searchableColumn) {
            setColumnFilters((prev) => {
                // Remove previous search filter for this column
                const otherFilters = prev.filter(
                    (f) => f.id !== searchableColumn
                )
                if (searchInputValue) {
                    return [
                        ...otherFilters,
                        { id: searchableColumn, value: searchInputValue }
                    ]
                }
                return otherFilters
            })
        }
        // Only runs when searchInputValue or searchableColumn changes
    }, [searchInputValue, searchableColumn])

    // When filter is cleared externally, clear input value as well
    React.useEffect(() => {
        if (searchableColumn) {
            const filterVal = columnFilters.find(f => f.id === searchableColumn)?.value ?? ""
            if (filterVal !== searchInputValue) {
                setSearchInputValue(String(filterVal ?? ""))
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnFilters, searchableColumn])

    const table = useReactTable({
        data,
        columns: [
            ...(selectable
                ? [
                    {
                        id: "select",
                        header: ({ table }) => (
                            <Checkbox
                                checked={
                                    table.getIsAllPageRowsSelected() ||
                                    (table.getIsSomePageRowsSelected() && "indeterminate")
                                }
                                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                                aria-label="Select all"
                            />
                        ),
                        cell: ({ row }) => (
                            <Checkbox
                                checked={row.getIsSelected()}
                                onCheckedChange={(value) => row.toggleSelected(!!value)}
                                aria-label="Select row"
                            />
                        ),
                        enableSorting: false,
                        enableHiding: false,
                        meta: { className: "text-center w-12" },
                    } as ColumnDef<TData, unknown>,
                ]
                : []),
            ...columns,
        ],
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    const selectedRows = table.getFilteredSelectedRowModel().rows.map((r) => r.original)

    return (
        <div className="space-y-4">
            {/* Barre de recherche et filtres */}
            <div className="flex flex-wrap items-center gap-2">
                {searchableColumn && (
                    <Input
                        placeholder="Rechercher..."
                        value={searchInputValue}
                        onChange={(e) => {
                            setSearchInputValue(e.target.value)
                        }}
                        className="w-[300px] border-2 border-gray-300 rounded-md"
                        data-testid="datatable-search-input"
                    />
                )}

                {filters.map((filter) => {
                    const column = table.getColumn(filter.id)
                    const currentValue = column?.getFilterValue() as string | undefined

                    return (
                        <DropdownMenu key={filter.id}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="capitalize" size="sm">
                                    {currentValue && currentValue.length > 0 ? currentValue : filter.label}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem
                                    onSelect={(event) => {
                                        event.preventDefault()
                                        column?.setFilterValue(undefined)
                                    }}
                                    className="capitalize"
                                >
                                    {filter.label}
                                </DropdownMenuItem>
                                {filter.options.map((opt) => {
                                    const isSelected = currentValue === opt
                                    return (
                                        <DropdownMenuItem
                                            key={opt}
                                            onSelect={(event) => {
                                                event.preventDefault()
                                                column?.setFilterValue(opt)
                                            }}
                                            className="capitalize flex items-center justify-between"
                                        >
                                            {opt}
                                            {isSelected && <CheckIcon className="h-4 w-4 text-primary" />}
                                        </DropdownMenuItem>
                                    )
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                })}

                {/* Actions de masse */}
                {bulkActions.length > 0 && selectedRows.length > 0 && (
                    <div className="flex gap-2">
                        {bulkActions.map((action, idx) => {
                            const Icon = action.icon
                            return (
                                <Button
                                    key={idx}
                                    variant={action.variant ?? "default"}
                                    onClick={() => action.onClick(selectedRows)}
                                    size="sm"
                                >
                                    {selectedRows.length}
                                    {Icon && <Icon className="mr-1 h-4 w-4" />}
                                    {action.label}
                                </Button>
                            )
                        })}
                    </div>
                )}
                <ColumnVisibilityMenu table={table} />
            </div>

            {/* Tableau */}
            <div className="rounded-md border overflow-x-auto w-full">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-gray-900 text-white hover:bg-gray-900">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className={cn("text-xs text-white", header.column.columnDef.meta?.className)}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                                {actions.length > 0 && (
                                    <TableHead className="text-white text-xs">Actions</TableHead>
                                )}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow className="cursor-pointer" key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            onClick={() => {
                                                if (onClick) {
                                                    onClick(row.original)
                                                }
                                            }}
                                            className={cn(cell.column.columnDef.meta?.className, "text-xs ") + `${onClick ? 'cursor-pointer' : ''}`}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                    {actions.length > 0 && (
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="btn-exclude border-1 border-gray-300 bg-gray-50 text-black h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {actions.map((action, idx) => {
                                                        const Icon = action.icon
                                                        return (
                                                            <DropdownMenuItem
                                                                key={idx}
                                                                onClick={() => action.onClick(row.original)}
                                                                className={
                                                                    action.variant === "destructive"
                                                                        ? "text-red-600 focus:text-red-600"
                                                                        : ""
                                                                }
                                                            >
                                                                {Icon && <Icon className="mr-2 h-4 w-4" />}
                                                                {action.label}
                                                            </DropdownMenuItem>
                                                        )
                                                    })}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="text-center">
                                    Aucun résultat
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Précédent
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Suivant
                </Button>
            </div>
        </div>
    )
}
