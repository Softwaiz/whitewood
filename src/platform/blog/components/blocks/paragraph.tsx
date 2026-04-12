import { cn } from "~lib/utils";
import { createMarginStyle, MarginField, type Margin } from "../fields/margin";
import { createPaddingStyle, PaddingField, type Padding } from "../fields/padding";
import type { ComponentConfig } from "@puckeditor/core";
import { RichTextField } from "../fields/text-editor";

export interface ParagraphProps {
    children: string;
    size: "xs" | "sm" | "base" | "lg",
    margin: Margin;
    padding: Padding;
}

function render({ children, margin, padding, size }: ParagraphProps) {
    return <div
            className={
                cn(
                    "text-base text-neutral-800 w-full",
                    size === "xs" && "text-xs",
                    size === "sm" && "text-sm",
                    size === "base" && "text-sm md:text-base",
                    size === "lg" && "text-sm lg:text-lg"
                )
            }
            style={{
                ...createMarginStyle(margin),
                ...createPaddingStyle(padding)
            }}
            dangerouslySetInnerHTML={{ __html: children }} />
}

export const Paragraph: ComponentConfig<ParagraphProps> = {
    label: "Paragraph",
    fields: {
        children: RichTextField,
        size: {
            type: "radio",
            options: [
                { label: "xs", value: "xs" },
                { label: "sm", value: "sm" },
                { label: "base", value: "base" },
                { label: "lg", value: "lg" }
            ]
        },
        padding: PaddingField,
        margin: MarginField
    },
    render,
    defaultProps: {
        children: "This is a sample paragraph",
        size: "base",
        padding: { top: 0, left: 0, right: 0, bottom: 0 },
        margin: { top: 0, left: 0, right: 0, bottom: 0 }
    }
}