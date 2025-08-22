"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { Vehicle, VehicleStatusEnum } from "@/types";
import { ModelTypeEnum } from "@/types/Model";
import {
    Slider,
    MultiSelect,
    MultiSelectTrigger,
    MultiSelectValue,
    MultiSelectContent,
    MultiSelectItem,
    MultiSelectGroup,
} from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import { fetchOrThrow, normalizeString } from "@/lib/utils";

export function VehiclesFilters({
    table,
    onChargeChange,
}: {
    table: Table<Vehicle>;
    onChargeChange?: (n: number) => void;
}) {
    const {
        isLoading: BrandLoading,
        error: BrandError,
        data: brands,
    } = useQuery({
        queryKey: ["brands"],
        queryFn: () => fetchOrThrow("/api/brands").then((res) => res.json()),
    });

    const {
        isLoading: ModelLoading,
        error: ModelError,
        data: models,
    } = useQuery({
        queryKey: ["models"],
        queryFn: () => fetchOrThrow("/api/models").then((res) => res.json()),
    });

    console.log("brands", brands);
    console.log("models", models);

    // local selection state so we can filter model options by brand
    const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);

    // API model shape
    type ApiModel = { name: string; Brand?: { name?: string } };

    // ensure models query is typed
    // (note: useQuery generic expected above; we can't change the hook call easily here
    // so we'll just assert the shape when mapping below)

    // Transform brands and models from API objects to string arrays
    const brandNames = React.useMemo(
        () =>
            brands?.map((brand: { name: string }) =>
                normalizeString(brand.name)
            ) ?? [],
        [brands]
    );

    // Filter model options to only those which belong to the selected brand(s).
    // If no brand is selected, show all models.
    const filteredModelNames = React.useMemo(() => {
        if (!models) return [] as string[];
        const typed = models as ApiModel[];
        if (!selectedBrands || selectedBrands.length === 0) {
            return typed.map((m) => (m.name ?? "").toString());
        }

        // Normalize selected brand names for robust comparison
        const selectedNorm = new Set(
            selectedBrands.map((s) => normalizeString(s))
        );

        return typed
            .filter((m) => {
                const brandName = m.Brand?.name;
                if (brandName == null) return false;
                return selectedNorm.has(normalizeString(brandName));
            })
            .map((m) => (m.name ?? "").toString());
    }, [models, selectedBrands]);

    const batteryMinMax = { min: 0, max: 100 };

    if (BrandLoading || ModelLoading)
        return (
            <div className="flex items-center gap-4 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex flex-col text-sm">
                        <span className="text-muted-foreground text-xs">
                            Brand
                        </span>
                        <div className="h-10 min-w-[160px] animate-pulse rounded-md"></div>
                    </div>

                    <div className="flex flex-col text-sm">
                        <span className="text-muted-foreground text-xs">
                            Model
                        </span>
                        <div className="h-10 min-w-[160px] animate-pulse rounded-md"></div>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-xs">
                            Current charge threshold
                        </span>
                        <div className="h-4 w-20 animate-pulse rounded"></div>
                    </div>
                    <div className="mt-2">
                        <div className="h-2 w-full animate-pulse rounded"></div>
                    </div>
                </div>
            </div>
        );
    if (BrandError) return "An error has occurred: " + BrandError.message;
    if (ModelError) return "An error has occurred: " + ModelError.message;

    function setBrand(values: string[]) {
        // set an array filter value; clear the filter when no values are selected
        table
            .getColumn("brand")
            ?.setFilterValue(values && values.length ? values : undefined);
    }

    function setModel(values: string[]) {
        table
            .getColumn("model")
            ?.setFilterValue(values && values.length ? values : undefined);
    }

    function setBattery([value]: number[]) {
        if (onChargeChange) onChargeChange(value ?? 0);
    }

    const STATUS_OPTIONS = [
        { value: VehicleStatusEnum.Available, label: "Available" },
        { value: VehicleStatusEnum.InUse, label: "In Use" },
        { value: VehicleStatusEnum.Charging, label: "Charging" },
    ];

    function setStatus(values: string[]) {
        table
            .getColumn("status")
            ?.setFilterValue(values && values.length ? values : undefined);
    }

    // Model type options derived from ModelTypeEnum (BEV / ICE)
    const MODEL_TYPE_OPTIONS = [
        { value: ModelTypeEnum.BEV, label: "BEV" },
        { value: ModelTypeEnum.ICE, label: "ICE" },
    ];

    function setModelType(values: string[]) {
        table
            .getColumn("Type")
            ?.setFilterValue(values && values.length ? values : undefined);
    }

    return (
        <div className="flex justify-between gap-4 p-4">
            <div className="flex items-center gap-3">
                <div className="flex flex-col text-sm">
                    <span className="text-muted-foreground text-xs">Brand</span>
                    <MultiSelect
                        onValuesChange={(vals) => {
                            setSelectedBrands(vals);
                            setBrand(vals);
                            setModel([]);
                        }}
                    >
                        <MultiSelectTrigger className="text-foreground min-w-[200px] rounded-md px-3 py-2 text-sm">
                            <MultiSelectValue placeholder="All" />
                        </MultiSelectTrigger>
                        <MultiSelectContent>
                            <MultiSelectGroup>
                                {brandNames.map((brand: string) => (
                                    <MultiSelectItem key={brand} value={brand}>
                                        {brand}
                                    </MultiSelectItem>
                                ))}
                            </MultiSelectGroup>
                        </MultiSelectContent>
                    </MultiSelect>
                </div>

                <div className="flex flex-col text-sm">
                    <span className="text-muted-foreground text-xs">Model</span>
                    <MultiSelect onValuesChange={(vals) => setModel(vals)}>
                        <MultiSelectTrigger className="text-foreground min-w-[200px] rounded-md px-3 py-2 text-sm">
                            <MultiSelectValue placeholder="All" />
                        </MultiSelectTrigger>
                        <MultiSelectContent>
                            <MultiSelectGroup>
                                {filteredModelNames.map((model: string) => (
                                    <MultiSelectItem key={model} value={model}>
                                        {model}
                                    </MultiSelectItem>
                                ))}
                            </MultiSelectGroup>
                        </MultiSelectContent>
                    </MultiSelect>
                </div>

                <div className="flex flex-col text-sm">
                    <span className="text-muted-foreground text-xs">
                        Status
                    </span>
                    <MultiSelect onValuesChange={(vals) => setStatus(vals)}>
                        <MultiSelectTrigger className="text-foreground min-w-[200px] rounded-md px-3 py-2 text-sm">
                            <MultiSelectValue placeholder="All" />
                        </MultiSelectTrigger>
                        <MultiSelectContent>
                            <MultiSelectGroup>
                                {STATUS_OPTIONS.map((s) => (
                                    <MultiSelectItem
                                        key={s.value}
                                        value={s.value}
                                    >
                                        {s.label}
                                    </MultiSelectItem>
                                ))}
                            </MultiSelectGroup>
                        </MultiSelectContent>
                    </MultiSelect>
                </div>

                <div className="flex flex-col text-sm">
                    <span className="text-muted-foreground text-xs">
                        Model type
                    </span>
                    <MultiSelect onValuesChange={(vals) => setModelType(vals)}>
                        <MultiSelectTrigger className="text-foreground min-w-[200px] rounded-md px-3 py-2 text-sm">
                            <MultiSelectValue placeholder="All" />
                        </MultiSelectTrigger>
                        <MultiSelectContent>
                            <MultiSelectGroup>
                                {MODEL_TYPE_OPTIONS.map((t) => (
                                    <MultiSelectItem
                                        key={t.value}
                                        value={t.value}
                                    >
                                        {t.label}
                                    </MultiSelectItem>
                                ))}
                            </MultiSelectGroup>
                        </MultiSelectContent>
                    </MultiSelect>
                </div>
            </div>

            <div className="max-w-[400px] flex-1">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">
                        Current charge threshold
                    </span>
                    <span className="text-sm">
                        {batteryMinMax.min} - {batteryMinMax.max} %
                    </span>
                </div>
                <div className="mt-2">
                    {/* It's kinda broken but in real world th ICE vehicules should return null and not zero for battery and not be included  */}
                    <Slider
                        defaultValue={[100]}
                        min={0}
                        max={100}
                        onValueChange={(v) => setBattery(v as number[])}
                    />
                </div>
            </div>
        </div>
    );
}

export default VehiclesFilters;
