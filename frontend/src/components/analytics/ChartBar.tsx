import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

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

export const description = "A bar chart with a label";

type ChartDataType = { x: string; y: number }[];

type Props = {
    data: ChartDataType;
    title?: string;
    subtitle?: string;
    description?: React.ReactNode;
};

export function ChartBar({ data, description: desc, title, subtitle }: Props) {
    const chartConfig: ChartConfig = {
        chart: {
            color: "var(--color-accent)",
        },
    };
    return (
        <Card className="bar-chart">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            top: 20,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="x"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value: string) =>
                                String(value).slice(0, 3)
                            }
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="y" fill="var(--color-accent)" radius={8}>
                            <LabelList
                                dataKey="y"
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                {desc}
            </CardFooter>
        </Card>
    );
}
