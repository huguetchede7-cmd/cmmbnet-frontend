import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function DataTableSkeleton({
                                      columns = 5,
                                      rows = 8
                                  }: {
    columns?: number
    rows?: number
}) {
    return (
        <div className="space-y-4 animate-pulse">
            {/* Barre de recherche et filtres skeleton */}
            <div className="flex flex-wrap items-center gap-2">
                <div className="h-9 w-[200px] bg-gray-200 rounded-md" />
                <div className="h-9 w-24 bg-gray-200 rounded-md" />
                <div className="h-9 w-24 bg-gray-200 rounded-md" />
            </div>

            {/* Tableau skeleton */}
            <div className="rounded-md border overflow-x-auto w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {Array.from({ length: columns }).map((_, i) => (
                                <TableHead key={i}>
                                    <div className="h-4 w-20 bg-gray-200 rounded" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: rows }).map((_, rowIdx) => (
                            <TableRow key={rowIdx}>
                                {Array.from({ length: columns }).map((_, colIdx) => (
                                    <TableCell key={colIdx}>
                                        <div className="h-4 w-full bg-gray-200 rounded" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination skeleton */}
            <div className="flex items-center justify-end space-x-2">
                <div className="h-8 w-20 bg-gray-200 rounded" />
                <div className="h-8 w-20 bg-gray-200 rounded" />
            </div>
        </div>
    )
}
