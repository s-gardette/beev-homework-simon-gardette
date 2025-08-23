"use client";
import { columns } from "./Columns";
import { Vehicle } from "@/types";
import { useMemo, useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
    SortingState,
} from "@tanstack/react-table";
import {
    MagnifyingGlassIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Input,
    Sheet,
    SheetTrigger,
    SheetContent,
    Button,
    Heading,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
} from "@/components/ui";
import { SeedDBButton } from "../SeedDBButton";
import VehiclesFilters from "./Filters";
import { VehicleAdd } from "@/pages/vehicle-add";

import { useQuery } from "@tanstack/react-query";
import { fetchOrThrow } from "@/lib/utils";

export function VehiclesTable({ rows = 10 }: { rows?: number }) {
    const { isLoading, error, data } = useQuery({
        queryKey: ["vehicles"],
        queryFn: () => fetchOrThrow("/api/vehicles").then((res) => res.json()),
    });

    console.log("vehicles data", data);

    // local table state: filter / sort / pagination
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [sorting, setSorting] = useState<SortingState>([
        { id: "updatedAt", desc: true },
    ]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: rows,
    });
    const [chargeThreshold, setChargeThreshold] = useState<number | null>(null);

    const vehiclesRaw = useMemo(() => (data ?? []) as Vehicle[], [data]);
    const vehicles = useMemo(() => {
        if (chargeThreshold == null) return vehiclesRaw;
        return vehiclesRaw.filter((v) => {
            const lvl = v.vehicleStatus?.currentChargeLevel;
            return typeof lvl === "number" ? lvl <= chargeThreshold : true;
        });
    }, [vehiclesRaw, chargeThreshold]);

    const table = useReactTable({
        columns: useMemo(() => columns, []),
        data: vehicles,
        state: { globalFilter, sorting, pagination },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 20 } },
    });

    if (isLoading)
        return (
            <div className="mb-8 overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((_, idx) => (
                                <TableHead key={String(idx)}>
                                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, rowIdx) => (
                            <TableRow key={rowIdx}>
                                {columns.map((_, colIdx) => (
                                    <TableCell key={String(colIdx)}>
                                        <div className="h-6 animate-pulse rounded bg-gray-200" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    if (error) return "An error has occurred: " + (error as Error).message;
    if (vehicles.length === 0 && !isLoading && !error) {
        return (
            <>
                <div className="mb-8 overflow-hidden rounded-md border p-6">
                    No vehicles available
                </div>
                <div className="mb-8 overflow-hidden rounded-md border p-6">
                    Add some vehicles manually or use the &quot;Seed
                    Database&quot; button below to populate with sample data.
                    <div className="mt-4">
                        <SeedDBButton />
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="mb-8 overflow-hidden rounded-md border">
            {/* Header and toolbar */}
            <div className="border-b px-6 py-4">
                <div className="mx-auto flex max-w-6xl items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Heading variant="h3">Vehicles</Heading>
                        <span className="text-sm text-gray-600 mt-4">
                            ({table.getFilteredRowModel().rows.length})
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-xl">
                            <Input
                                icon={
                                    <MagnifyingGlassIcon className="h-4 w-4 text-slate-400" />
                                }
                                value={globalFilter}
                                onChange={(e) =>
                                    setGlobalFilter(e.target.value)
                                }
                                placeholder="Search vehicles"
                            ></Input>
                        </div>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Add Vehicle
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="">
                                <div className=" p-8">
                                    <VehicleAdd noContext={true} />
                                </div>
                            </SheetContent>
                        </Sheet>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    <ChevronDownIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(
                                                        !!value
                                                    )
                                                }
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            <VehiclesFilters
                table={table}
                onChargeChange={(n) => setChargeThreshold(n)}
            />
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={`flex items-center gap-2 ${header.column.getCanSort() ? "cursor-pointer select-none" : ""}`}
                                                onClick={header.column.getToggleSortingHandler?.()}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                                {/* simple sort indicator */}
                                                <span className="text-xs opacity-60">
                                                    {header.column.getIsSorted()
                                                        ? header.column.getIsSorted() ===
                                                          "asc"
                                                            ? "▲"
                                                            : "▼"
                                                        : ""}
                                                </span>
                                            </div>
                                        )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* Pagination (shadcn-style simple controls) */}
            <div className="flex items-center justify-between space-x-2 p-4">
                <div className="flex items-center gap-2">
                    <button
                        className="rounded border px-2 py-1 text-sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </button>
                    <button
                        className="rounded border px-2 py-1 text-sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </button>
                    <span className="text-sm">Page</span>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </strong>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <label className="flex items-center gap-2">
                        Rows per page:
                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={(e) =>
                                table.setPageSize(Number(e.target.value))
                            }
                            className="rounded border px-2 py-1"
                        >
                            {[5, 10, 20, 50].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>
        </div>
    );
}
