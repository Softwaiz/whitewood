import type { ComponentConfig, SlotComponent } from "@puckeditor/core";
import { Card as CardBase, CardContent, CardFooter, CardHeader } from "~components/ui/card";
import { createPaddingStyle, PaddingField, type Padding } from "../fields/padding";
import { createMarginStyle, MarginField, type Margin } from "../fields/margin";
import { cn } from "~lib/utils";

export interface SpacerProps {
    margin: Margin;
    padding: Padding;
    orientation: "horizontal" | "vertical";
    size: "sm" | "md" | "lg" | "xl"
}

function render({ margin, padding, size, orientation }: SpacerProps) {
    return <span
    className={
        orientation === "horizontal" ? cn(
            "w-full block",
            size === "sm" &&  "h-4",
            size === "md" && "h-8",
            size === "lg" && "h-16",
            size === "xl" && "h-40"
        ) : cn(
            "h-full block",
            size === "sm" &&  "w-4",
            size === "md" && "w-8",
            size === "lg" && "w-16",
            size === "xl" && "w-40"
        )

    }
        style={{
            ...createMarginStyle(margin),
            ...createPaddingStyle(padding)
        }}>
       
    </span>
}

export const Spacer: ComponentConfig<SpacerProps> = {
    label: "Spacer",
    fields: {
        padding: PaddingField,
        margin: MarginField,
        size: {
            type: "radio",
            options: [
                { label: "Small", value: "sm" },
                { label: "Medium", value: "md" },
                { label: "Large", value: "lg" },
                { label: "ExtraLarge", value: "xl" }
            ]
        },
        orientation: {
            type: "radio",
            options: [
                { label: "Horizontal", value: "horizontal" },
                { label: "Vertical", value: "vertical" },
            ]
        },
    },
    render,
    defaultProps: {
        padding: { top: 0, left: 0, right: 0, bottom: 0 },
        margin: { top: 0, left: 0, right: 0, bottom: 0 },
        size: "md",
        orientation: "horizontal"
    }
}