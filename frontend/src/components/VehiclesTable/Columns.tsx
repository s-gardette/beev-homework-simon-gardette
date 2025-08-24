import { ColumnDef } from "@tanstack/react-table";
import { Vehicle } from "@/types";
import { matchesArrayOrString } from "@/lib/utils";
import { Button } from "@/components/ui";
import { NavLink } from "react-router";
import { ChargeLevel } from "@/components/ChargeLevel";
import { StatusBadge } from "@/components/StatusBadge";

export const columns: ColumnDef<Vehicle>[] = [
    {
        id: "name",
        accessorFn: (row) => row.name ?? "-",
        header: "Name",
        cell: ({ getValue }) => (
            <span className="text-sm font-medium">{String(getValue())}</span>
        ),
    },
    {
        id: "brand",
        accessorFn: (row) => row.brand?.name ?? "-",
        filterFn: (row, columnId, value) =>
            matchesArrayOrString(row.getValue(columnId), value),
        header: "Brand",
        cell: ({ getValue }) => (
            <span className="text-sm">{String(getValue())}</span>
        ),
    },
    {
        id: "model",
        accessorFn: (row) => row.model?.name ?? "-",
        filterFn: (row, columnId, value) =>
            matchesArrayOrString(row.getValue(columnId), value),
        header: "Model",
        cell: ({ getValue }) => (
            <span className="text-muted-foreground text-sm">
                {String(getValue())}
            </span>
        ),
    },
    {
        id: "status",
        accessorFn: (row) => row.vehicleStatus?.status ?? "unknown",
        filterFn: (row, columnId, value) =>
            matchesArrayOrString(row.getValue(columnId), value),
        header: "Status",
        cell: ({ getValue }) => (
            <StatusBadge status={String(getValue() || "unknown")} />
        ),
    },
    {
        id: "charge",
        accessorFn: (row) => row.vehicleStatus?.currentChargeLevel ?? null,
        header: "Current Charge Level",
        cell: ({ getValue, row }) => {
            const type = row.original?.model?.Type;
            const isBev = String(type ?? "").toUpperCase() === "BEV";
            if (!isBev) {
                return <span className="text-sm">N/A</span>;
            }
            const lvl = getValue() as number | null;
            return <ChargeLevel level={lvl} />;
        },
    },

    {
        id: "updatedAt",
        accessorFn: (row) => row.vehicleStatus?.updatedAt ?? null,
        header: "Last Updated",
        cell: ({ getValue }) => {
            const v = getValue() as string | null;
            if (!v) {
                return <span className="text-sm">-</span>;
            }
            const d = new Date(v);
            const formatted = isNaN(d.getTime())
                ? String(v)
                : d.toLocaleString();
            return <span className="text-sm">{formatted}</span>;
        },
    },
    {
        id: "Type",
        accessorFn: (row) => row.model?.Type ?? "-",
        filterFn: (row, columnId, value) =>
            matchesArrayOrString(row.getValue(columnId), value),
        header: "Type",
        cell: ({ getValue }) => (
            <span className="text-sm">{String(getValue())}</span>
        ),
    },
    {
        id: "viewDetails",
        header: "",
        accessorFn: (row) => row.id,
        cell: ({ getValue }) => (
            <Button variant="link" size="sm">
                <NavLink
                    to={`/vehicles/${getValue()}`}
                    className="text-foreground text-sm font-medium hover:underline"
                >
                    View Details
                </NavLink>
            </Button>
        ),
    },
];
