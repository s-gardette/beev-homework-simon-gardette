import * as React from "react";

import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
    icon?: React.ReactNode;
};

function Input({ icon, className, type, ...props }: InputProps) {
    const hasIcon = Boolean(icon);

    return (
        <div className="relative w-full">
            {hasIcon && (
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    {icon}
                </span>
            )}
            <input
                type={type}
                data-slot="input"
                className={cn(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-background selection:text-foreground-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent pr-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    hasIcon ? "pl-10" : "pl-3",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                    className
                )}
                {...props}
            />
        </div>
    );
}

export { Input };
