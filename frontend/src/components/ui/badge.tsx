/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3",
    {
        variants: {
            variant: {
                default:
                    "bg-background text-foreground [a&]:hover:bg-background/90 border-transparent",
                secondary:
                    "bg-background text-foreground [a&]:hover:bg-background/90 border-transparent",
                destructive:
                    "bg-destructive [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-foreground border-transparent",
                outline:
                    "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
                available: "text-background border-blue-300 bg-green-100",
                inUse: "text-background border border-blue-300 bg-blue-100",
                charging:
                    "text-background border border-yellow-500 bg-yellow-100",
                alert: "bg-destructive/80 text-background border-destructive border",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

function Badge({
    className,
    variant,
    asChild = false,
    ...props
}: React.ComponentProps<"span"> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : "span";

    return (
        <Comp
            data-slot="badge"
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    );
}

export { Badge, badgeVariants };
