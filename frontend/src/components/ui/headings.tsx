import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva(
    "text-foreground font-heading font-bold tracking-tight",
    {
        variants: {
            variant: {
                h1: "text-4xl leading-tight md:text-5xl lg:text-6xl",
                h2: "text-3xl leading-tight md:text-4xl lg:text-5xl",
                h3: "text-2xl leading-tight md:text-3xl lg:text-4xl",
                h4: "text-xl leading-tight md:text-2xl lg:text-3xl",
                h5: "text-lg leading-tight md:text-xl lg:text-2xl",
                h6: "text-base leading-tight md:text-lg lg:text-xl",
                display:
                    "text-5xl leading-tight md:text-6xl lg:text-7xl xl:text-8xl",
                hero: "text-4xl leading-tight md:text-5xl lg:text-6xl xl:text-7xl",
            },
            weight: {
                light: "font-light",
                normal: "font-normal",
                medium: "font-medium",
                semibold: "font-semibold",
                bold: "font-bold",
                extrabold: "font-extrabold",
                black: "font-black",
            },
            align: {
                left: "text-left",
                center: "text-center",
                right: "text-right",
            },
            spacing: {
                normal: "tracking-normal",
                tight: "tracking-tight",
                tighter: "tracking-tighter",
                wide: "tracking-wide",
                wider: "tracking-wider",
            },
        },
        defaultVariants: {
            variant: "h1",
            weight: "bold",
            align: "left",
            spacing: "tight",
        },
    }
);

export interface HeadingProps
    extends React.HTMLAttributes<HTMLHeadingElement>,
        VariantProps<typeof headingVariants> {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span";
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, variant, weight, align, spacing, as, ...props }, ref) => {
        // Determine the HTML element to render
        const Component =
            as ||
            (variant === "display" || variant === "hero" ? "h1" : variant) ||
            "h1";

        // Generate the variant classes
        const variantClasses = headingVariants({
            variant,
            weight,
            align,
            spacing,
        });
        const finalClasses = cn(variantClasses, className);

        return <Component className={finalClasses} ref={ref} {...props} />;
    }
);
Heading.displayName = "Heading";

export { Heading, headingVariants };
