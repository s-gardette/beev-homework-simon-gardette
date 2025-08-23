import { useEffect } from "react";
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
import { fetchOrThrow } from "@/lib/utils";

type Brand = { id: string; name: string };

type FormValues = {
    name: string;
    brand: string;
    batteryCapacity: number;
    averageConsumption: number;
    emissionGCO2: number;
    Type: "BEV" | "ICE";
};

export function ModelAdd() {
    const { setHeading } = usePageContext();
    const queryClient = useQueryClient();

    useEffect(() => {
        setHeading("Add a Vehicle Model");
        return () => setHeading("");
    }, [setHeading]);

    const { data: brands, isLoading: brandsLoading } = useQuery<Brand[]>({
        queryKey: ["brands"],
        queryFn: () => fetchOrThrow("/api/brands").then((res) => res.json()),
    });

    const mutation = useMutation({
        mutationFn: (data: FormValues) => {
            const body = JSON.stringify({
                name: data.name,
                brand: data.brand,
                batteryCapacity: Number(data.batteryCapacity),
                averageConsumption: Number(data.averageConsumption),
                emissionGCO2: Number(data.emissionGCO2),
                Type: data.Type,
            });

            return fetchOrThrow(`/api/models`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body,
            }).then((res) => {
                if (!res.ok)
                    return res
                        .text()
                        .then((t) =>
                            Promise.reject(
                                new Error(t || "Failed to add model")
                            )
                        );
                return res.json();
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["models"] });
        },
    });

    const form = useForm<FormValues>({
        defaultValues: {
            name: "",
            brand: "",
            batteryCapacity: 50,
            averageConsumption: 150,
            emissionGCO2: 0,
            Type: "BEV",
        },
    });
    const { handleSubmit, control, reset } = form;

    const onSubmit = async (data: FormValues) => {
        await mutation.mutateAsync(data);
        reset({
            name: "",
            brand: "",
            batteryCapacity: 50,
            averageConsumption: 150,
            emissionGCO2: 0,
            Type: "BEV",
        });
    };

    const loading = mutation.status === "pending";
    const isError = mutation.status === "error";
    const isSuccess = mutation.status === "success";

    return (
        <div className="space-y-6">
            <Form {...form}>
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
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="brand"
                        defaultValue=""
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brand</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger disabled={brandsLoading}>
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
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-4">
                        <FormField
                            control={control}
                            name="batteryCapacity"
                            defaultValue={50}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Battery capacity (kWh)
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="averageConsumption"
                            defaultValue={150}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Average consumption (Wh/km)
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex gap-4">
                        <FormField
                            control={control}
                            name="emissionGCO2"
                            defaultValue={0}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Emissions (gCO2/km)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="Type"
                            defaultValue="BEV"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Powertrain</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="BEV">
                                                    BEV
                                                </SelectItem>
                                                <SelectItem value="ICE">
                                                    ICE
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="pt-2">
                        <Button
                            variant="outline"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </Button>
                        {isError && (
                            <p className="text-destructive mt-2 text-sm">
                                {(mutation.error as Error)?.message ??
                                    "Failed to submit"}
                            </p>
                        )}
                        {isSuccess && (
                            <p className="text-success mt-2 text-sm">
                                Model added successfully
                            </p>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
}
