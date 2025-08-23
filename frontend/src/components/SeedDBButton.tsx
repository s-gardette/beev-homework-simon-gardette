import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { fetchOrThrow } from "@/lib/utils";

export function SeedDBButton() {
    const { isPending, error, mutate } = useMutation({
        mutationFn: () =>
            fetchOrThrow("/api/seed", { method: "POST" }).then((res) =>
                res.json()
            ),
        onSuccess: () => {
            window.location.reload();
        },
    });

    return (
        <div>
            <Button
                variant="outline"
                onClick={() => {
                    mutate();
                }}
                disabled={isPending}
            >
                {isPending ? "Seeding..." : "Seed Database"}
            </Button>
            {error && (
                <p className="mt-2 text-sm text-red-600">
                    An error occurred: {error.message}
                </p>
            )}
        </div>
    );
}
