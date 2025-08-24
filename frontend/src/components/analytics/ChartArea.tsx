import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui";

export const description = "An area chart with gradient fill";

type Series = { key: string; label?: string };
type ChartData = Record<string, unknown>[];

type Props = {
    data: ChartData;
    series: Series[];
    title?: string;
    subtitle?: string;
    description?: React.ReactNode;
    bigNumber?: React.ReactNode;
    xKey?: string;
    color?: string;
};

export function ChartArea({
    data,
    series,
    title,
    subtitle,
    description: desc,
    bigNumber,
    xKey,
    color,
}: Props) {
    const chartConfig: ChartConfig = Object.fromEntries(
        series.map((s) => [
            s.key,
            {
                label: s.label ?? s.key,
                color: `var(--${color ?? `chart-1`})`,
            },
        ])
    );

    return (
        <Card className="area-chart">
            <CardHeader>
                <CardTitle>{title ?? "Area Chart - Gradient"}</CardTitle>
                {bigNumber ? (
                    <div className="mt-2 text-4xl leading-none font-extrabold">
                        {bigNumber}
                    </div>
                ) : null}
                <CardDescription className="text-muted-foreground flex items-center gap-2 leading-none">
                    {subtitle ?? ""}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={xKey}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value: string) =>
                                String(value).slice(0, 3)
                            }
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <defs>
                            {series.map((s) => (
                                <linearGradient
                                    key={s.key}
                                    id={`fill-${s.key}`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor={`var(--${color ?? `chart-1`}))`}
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={`var(--${color ?? `chart-1`})`}
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            ))}
                        </defs>

                        {series.map((s) => (
                            <Area
                                key={s.key}
                                dataKey={s.key}
                                type="natural"
                                fill={`url(#fill-${s.key})`}
                                fillOpacity={0.4}
                                stroke={`var(--${color ?? `chart-1`})`}
                                stackId="a"
                            />
                        ))}
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <CardDescription>{desc}</CardDescription>
            </CardFooter>
        </Card>
    );
}
