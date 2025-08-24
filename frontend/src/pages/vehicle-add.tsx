import { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router";
import { fetchOrThrow, normalizeString } from "@/lib/utils";
import { usePageContext } from "../components/layout/PageContext.tsx";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input, Button } from "@/components/ui";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormField,
} from "@/components/ui/form";

type Brand = { id: string; name: string };
type Model = { id: string; name: string };

type ApiModel = Model & { Brand?: { id?: string; name?: string } };

type FormValues = {
    externalId?: string | null;
    name: string;
    brandId: string;
    modelId: string;
    currentChargeLevel: number;
    status: string;
};

export function VehicleAdd({
    mode = "add",
    noContext = false,
}: { mode?: "edit" | "add"; noContext?: boolean } = {}) {
    const { setHeading } = usePageContext();
    const queryClient = useQueryClient();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (!noContext) {
            setHeading(mode === "add" ? "Add a Vehicle" : "Edit Vehicle : ");
            return () => setHeading("");
        }
    }, [setHeading, mode, noContext]);

    const { data: brands, isLoading: brandsLoading } = useQuery<Brand[]>({
        queryKey: ["brands"],
        queryFn: () => fetchOrThrow("/api/brands").then((res) => res.json()),
    });

    const mutation = useMutation({
        mutationFn: (data: FormValues) => {
            const body = JSON.stringify({
                externalId:
                    data.externalId && String(data.externalId).trim() !== ""
                        ? data.externalId
                        : null,
                name: data.name,
                brandId: data.brandId,
                modelId: data.modelId,
                vehicleStatus: {
                    currentChargeLevel: Number(data.currentChargeLevel),
                    status: data.status,
                },
            });

            if (mode === "edit" && id) {
                return fetchOrThrow(`/api/vehicles/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body,
                }).then((res) => {
                    if (!res.ok)
                        return res
                            .text()
                            .then((t) =>
                                Promise.reject(
                                    new Error(t || "Failed to update vehicle")
                                )
                            );
                    return res.json();
                });
            }

            return fetchOrThrow("/api/vehicles/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body,
            }).then((res) => {
                if (!res.ok)
                    return res
                        .text()
                        .then((t) =>
                            Promise.reject(
                                new Error(t || "Failed to add vehicle")
                            )
                        );
                return res.json();
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
            queryClient.invalidateQueries({ queryKey: ["vehicle", id] });
        },
    });

    const { mutateAsync } = mutation;
    const loading = mutation.status === "pending";
    const isError = mutation.status === "error";
    const isSuccess = mutation.status === "success";
    const mutationError = mutation.error;

    const form = useForm<FormValues>({
        defaultValues: {
            externalId: "",
            currentChargeLevel: 80,
            status: "available",
        },
    });
    const { handleSubmit, control, reset, setValue } = form;

    const brandId = form.watch("brandId");

    const { data: models, isLoading: modelsLoading } = useQuery<ApiModel[]>({
        queryKey: ["models"],
        queryFn: () => fetchOrThrow(`/api/models`).then((res) => res.json()),
    });

    const {
        data: vehicleData,
        isLoading: vehicleLoading,
        error: vehicleError,
    } = useQuery({
        queryKey: ["vehicle", id],
        queryFn: () =>
            fetchOrThrow(`/api/vehicles/${id}`).then((res) => res.json()),
        enabled: mode === "edit" && Boolean(id),
    });

    const editLoading = mode === "edit" && Boolean(id) && vehicleLoading;

    const filteredModels = useMemo(() => {
        if (!models) return [] as ApiModel[];
        if (!brandId) return models as ApiModel[];

        const byId = (models as ApiModel[]).filter(
            (m) => m?.Brand?.id === brandId
        );
        if (byId.length > 0) return byId;

        const brandNorm = normalizeString(brandId);
        return (models as ApiModel[]).filter(
            (m) => normalizeString(m.Brand?.name) === brandNorm
        );
    }, [models, brandId]);

    const previousBrandIdRef = useRef<string | undefined>(undefined);
    useEffect(() => {
        if (!previousBrandIdRef.current) {
            previousBrandIdRef.current = brandId;
            return;
        }

        if (brandId && brandId !== previousBrandIdRef.current) {
            setValue("modelId", "");
        }

        previousBrandIdRef.current = brandId;
    }, [brandId, setValue]);

    useEffect(() => {
        if (mode === "edit" && vehicleData) {
            reset({
                externalId: vehicleData.externalId ?? "",
                name: vehicleData.name ?? "",
                brandId: vehicleData.brand?.id ?? vehicleData.brand ?? "",
                modelId: vehicleData.model?.id ?? vehicleData.model ?? "",
                currentChargeLevel: vehicleData.vehicleStatus?.currentChargeLevel ?? 80,
                status: vehicleData.vehicleStatus?.status ?? "available",
            });
        }
    }, [mode, vehicleData, reset]);

    const onSubmit = async (data: FormValues) => {
        const payload: FormValues = { ...data };
        if (!payload.name || !payload.name.trim()) {
            const brandObj =
                brands?.find((b) => b.id === payload.brandId) ||
                brands?.find(
                    (b) =>
                        normalizeString(b.name) ===
                        normalizeString(payload.brandId ?? "")
                );

            const modelObj =
                (models as ApiModel[])?.find((m) => m.id === payload.modelId) ||
                (models as ApiModel[])?.find(
                    (m) =>
                        normalizeString(m.name) ===
                        normalizeString(payload.modelId ?? "")
                );

            const generated = [
                brandObj?.name ?? payload.brandId,
                modelObj?.name ?? payload.modelId,
            ]
                .filter(Boolean)
                .join(" ")
                .trim();

            if (generated) {
                payload.name = generated;
                setValue("name", generated);
            }
        }

        await mutateAsync(payload);

        reset({
            externalId: "",
            currentChargeLevel: 80,
            status: "available",
        });
    };

    return (
        <div className="space-y-6">
            <Form {...form}>
                {vehicleError && (
                    <div className="text-destructive">
                        Error loading vehicle:{" "}
                        {(vehicleError as Error)?.message ??
                            "Failed to load vehicle"}
                    </div>
                )}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="max-w-lg space-y-4"
                >
                    <FormField
                        control={control}
                        name="name"
                        defaultValue=""
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex flex-col items-start">
                                    <span>Name (optional)</span>
                                    <span className="text-muted-foreground text-xs">
                                        if no name is provided will be created
                                        dynamically with brand and model
                                    </span>
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="externalId"
                        defaultValue=""
                        rules={{
                            pattern: {
                                value: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, // UUID v1-5
                                message: "externalId must be a valid UUID",
                            },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>External ID (optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value ?? ""}
                                        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-4">
                        <FormField
                            control={control}
                            name="brandId"
                            defaultValue=""
                            rules={{ required: "Brand is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Brand</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger
                                                disabled={brandsLoading}
                                            >
                                                <SelectValue
                                                    placeholder={
                                                        brandsLoading
                                                            ? "Loading..."
                                                            : "Select a brand"
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {brands?.map((b) => (
                                                    <SelectItem
                                                        key={b.id}
                                                        value={b.id}
                                                    >
                                                        {b.name}
                                                    </SelectItem>
                                                ))}
                                                {field.value &&
                                                    !brands?.some(
                                                        (b: Brand) =>
                                                            b.id ===
                                                            field.value
                                                    ) && (
                                                        <SelectItem
                                                            key={`selected-${field.value}`}
                                                            value={field.value}
                                                        >
                                                            {(vehicleData?.brand
                                                                ?.name as
                                                                | string
                                                                | undefined) ??
                                                                field.value}
                                                        </SelectItem>
                                                    )}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="modelId"
                            defaultValue=""
                            rules={{ required: "Model is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Model</FormLabel>
                                    <FormControl>
                                        <Select
                                            key={models ? 'models-loaded' : 'models-loading'}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger
                                                disabled={
                                                    !brandId || modelsLoading
                                                }
                                            >
                                                <SelectValue
                                                    placeholder={
                                                        !brandId
                                                            ? "Select a brand first"
                                                            : modelsLoading
                                                              ? "Loading..."
                                                              : "Select a model"
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filteredModels?.map(
                                                    (m: ApiModel) => (
                                                        <SelectItem
                                                            key={m.id}
                                                            value={m.id}
                                                        >
                                                            {m.name}
                                                        </SelectItem>
                                                    )
                                                )}
                                                {field.value &&
                                                    !filteredModels?.some(
                                                        (fm: ApiModel) =>
                                                            fm.id ===
                                                            field.value
                                                    ) && (
                                                        <SelectItem
                                                            key={`selected-${field.value}`}
                                                            value={field.value}
                                                        >
                                                            {(vehicleData?.model
                                                                ?.name as
                                                                | string
                                                                | undefined) ??
                                                                field.value}
                                                        </SelectItem>
                                                    )}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={control}
                        name="currentChargeLevel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current charge (%)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="status"
                        defaultValue="available"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">
                                                available
                                            </SelectItem>
                                            <SelectItem value="in_use">
                                                in_use
                                            </SelectItem>
                                            <SelectItem value="charging">
                                                charging
                                            </SelectItem>
                                            <SelectItem value="unavailable">
                                                unavailable
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="pt-2">
                        <Button
                            variant="outline"
                            type="submit"
                            disabled={loading || editLoading}
                        >
                            {loading
                                ? "Submitting..."
                                : editLoading
                                  ? "Loading..."
                                  : "Submit"}
                        </Button>
                        {isError && (
                            <p className="text-destructive mt-2 text-sm">
                                {(mutationError as Error)?.message ??
                                    "Failed to submit"}
                            </p>
                        )}
                        {isSuccess && (
                            <p className="text-success mt-2 text-sm">
                                {mode === "edit"
                                    ? "Vehicle updated successfully"
                                    : "Vehicle added successfully"}
                            </p>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
}
