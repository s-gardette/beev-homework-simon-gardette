import { useEffect } from "react";
import { usePageContext } from "../components/layout/PageContext.tsx";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input, Button } from "@/components/ui";
import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormField,
} from "@/components/ui/form";
import { fetchOrThrow } from "@/lib/utils";

type FormValues = {
    externalId?: string | null;
    name: string;
};

export function BrandAdd() {
    const { setHeading } = usePageContext();
    const queryClient = useQueryClient();

    useEffect(() => {
        setHeading("Add a Brand");
        return () => setHeading("");
    }, [setHeading]);

    const mutation = useMutation({
        mutationFn: (data: FormValues) => {
            // backend CreateBrandDto only expects { name } — ValidationPipe forbids unknown props
            const body = JSON.stringify({
                name: data.name,
            });
            return fetchOrThrow(`/api/brands`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body,
            }).then((res) => {
                if (!res.ok)
                    return res
                        .text()
                        .then((t) =>
                            Promise.reject(
                                new Error(t || "Failed to add brand")
                            )
                        );
                return res.json();
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
        },
    });

    const form = useForm<FormValues>({
        defaultValues: { externalId: "", name: "" },
    });
    const { handleSubmit, control, reset } = form;

    const onSubmit = async (data: FormValues) => {
        await mutation.mutateAsync(data);
        reset({ externalId: "", name: "" });
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
                                    <Input
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                                Brand added successfully
                            </p>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
}
